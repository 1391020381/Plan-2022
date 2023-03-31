import { Injectable, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import type { WsResponse } from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import Redis from 'ioredis';
import { isNil, pick } from 'lodash';
import WebSocket from 'ws';

import { getTime } from '@/modules/core/helpers';
import { WsExceptionFilter, WsPipe } from '@/modules/core/providers';
import { ClassToPlain } from '@/modules/core/types';
import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators';
import { RbacWsGuard } from '@/modules/rbac/guards';

import { PermissionChecker } from '@/modules/rbac/types';

import { RedisService } from '@/modules/redis/services';

import { WSAuthDto, WSMessageDto } from '../dtos/message.dto';
import { AccessTokenEntity } from '../entities/access-token.entity';
import { MessageEntity } from '../entities/message.entity';
import { UserEntity } from '../entities/user.entity';
import { MessageJob } from '../queue/message.job';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { SaveMessageQueueJob } from '../types';

type User = Pick<ClassToPlain<UserEntity>, 'id' | 'username' | 'nickname' | 'phone' | 'email'>;
interface Onliner {
    client: WebSocket;
    user: Partial<ClassToPlain<UserEntity>>;
    token: AccessTokenEntity;
}

const permissionChecker: PermissionChecker = async (ab) =>
    ab.can(PermissionAction.CREATE, MessageEntity.name);
/**
 * Websocket网关
 */
@Injectable()
@WebSocketGateway()
@UseFilters(new WsExceptionFilter())
@UsePipes(
    new WsPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
    }),
)
export class MessageGateway {
    protected redisClient: Redis;

    protected _onliners: Onliner[] = [];

    constructor(
        protected redisService: RedisService,
        protected tokenService: TokenService,
        protected userService: UserService,
        protected messageJob: MessageJob,
    ) {
        this.redisClient = this.redisService.getClient();
    }

    get onLiners() {
        return this._onliners;
    }

    @WebSocketServer()
    server!: WebSocket.Server;

    /**
     * 用户上线
     * @param data
     * @param client
     */
    @UseGuards(RbacWsGuard)
    @Permission(permissionChecker)
    @SubscribeMessage('online')
    async onLine(
        @MessageBody() data: WSAuthDto,
        @ConnectedSocket() client: WebSocket,
    ): Promise<WsResponse<Record<string, any>>> {
        const token = (await this.tokenService.checkAccessToken(data.token))!;
        const onliner = { token, user: token.user, client };
        this._onliners.push(onliner);
        // 把上线用户当前登录的客户端token值保存到Redis
        await this.redisClient.sadd('online', token.value);
        // 向在线用户发送消息
        const onliners = this._onliners.filter((o) => o.user.id !== token.user.id);
        onliners.forEach(({ client: c }) =>
            c.send(
                JSON.stringify({
                    event: 'message',
                    message: {
                        body: "I'm online now!",
                        sender: this.getUserInfo(token.user),
                        time: getTime().toString(),
                    },
                }),
            ),
        );
        // 用户下线事件处理
        client.on('close', async () => {
            client.terminate();
            await this.offlineHandler(onliner);
        });
        return {
            event: 'online',
            data: this.getUserInfo(token.user),
        };
    }

    /**
     * 用户下线
     * @param data
     * @param client
     */
    @UseGuards(RbacWsGuard)
    @Permission(permissionChecker)
    @SubscribeMessage('offline')
    async offLine(
        @MessageBody() data: WSAuthDto,
        @ConnectedSocket() client: WebSocket,
    ): Promise<WsResponse<Record<string, any>>> {
        const token = (await this.tokenService.checkAccessToken(data.token))!;
        const onliner = this.onLiners.find(({ token: t }) => t.id === token.id);
        if (!isNil(onliner)) await this.offlineHandler(onliner);
        return {
            event: 'offline',
            data: this.getUserInfo(token.user),
        };
    }

    /**
     * 发送消息
     * @param data
     */
    @UseGuards(RbacWsGuard)
    @Permission(permissionChecker)
    @SubscribeMessage('message')
    async sendMessage(
        @MessageBody()
        data: WSMessageDto,
    ): Promise<any> {
        const { sender, receviers } = await this.getMessager(data);
        const rcIds = receviers.map(({ id }) => id);
        // 只有在线用户才能实时接到消息,请自行通过推送等方式实现离线消息
        const onliners = this._onliners.filter((o) => rcIds.includes(o.user.id));
        const message: SaveMessageQueueJob = {
            title: data.title,
            body: data.body,
            type: data.type,
            sender: sender.id,
            receviers: rcIds,
        };
        // 保存消息到数据库
        await this.messageJob.save(message);
        // 向在线用户发送消息
        onliners.forEach(({ client }) =>
            client.send(
                JSON.stringify({
                    event: 'message',
                    message: {
                        ...pick(message, ['title', 'body', 'type']),
                        sender: this.getUserInfo(sender),
                        time: getTime().toString(),
                    },
                }),
            ),
        );
        return undefined;
    }

    /**
     * 消息异常
     * @param data
     */
    @SubscribeMessage('exception')
    sendException(
        @MessageBody()
        data: {
            status: string;
            message: any;
        },
    ): WsResponse<Record<string, any>> {
        return { event: 'exception', data };
    }

    /**
     * 获取消息的发送者和接收者的模型对象
     * @param data
     */
    protected async getMessager(
        data: WSMessageDto,
    ): Promise<{ sender: UserEntity; receviers: UserEntity[] }> {
        // 根据接收者的ID查询出所有接收者的模型对象
        const rs = await this.userService.list({ addQuery: (q) => q.whereInIds(data.receviers) });
        // 从接收者中过滤掉发送者自己
        const filterRS = (s: UserEntity, list: UserEntity[]) => list.filter((r) => s.id !== r.id);
        const token = await this.tokenService.checkAccessToken(data.token);
        // 判断发送者是否上线,必须处于上线状态才能发送消息
        if (isNil(this._onliners.find((o) => o.token.id === token.id))) {
            throw new WsException('You are not on line');
        }
        const sender = token.user;
        return {
            sender,
            receviers: filterRS(sender, rs),
        };
    }

    /**
     * 用户下线
     * @param param0
     */
    protected async offlineHandler({ token }: Onliner) {
        this._onliners = this._onliners.filter((o) => o.user.id !== token.user.id);
        // 从redis中删除下线用户的token
        await this.redisClient.srem('online', token.value);
        // 像所有用户发送用户下线通知
        this._onliners.forEach(({ client: c }) =>
            c.send(
                JSON.stringify({
                    event: 'message',
                    message: {
                        body: "I'm offline,bye!",
                        sender: this.getUserInfo(token.user),
                        time: getTime().toString(),
                    },
                }),
            ),
        );
    }

    /**
     * 获取当前在线用户
     */
    protected async getOnlineUsers() {
        const tokens = await this.redisClient.smembers('online');
        return (
            await Promise.all(
                tokens.map(async (t) => {
                    const token = await this.tokenService.checkAccessToken(t);
                    return isNil(token) ? undefined : this.getUserInfo(token.user);
                }),
            )
        )
            .filter((u) => isNil(u))
            .reduce<User[]>((o, n) => {
                if (o.find((u) => u.id === n.id)) return o;
                return [...o, n];
            }, []);
    }

    /**
     * 序列化用户模型对象
     * @param user
     */
    protected getUserInfo(user: UserEntity) {
        return pick(instanceToPlain(user, { groups: ['user-item'] }), [
            'id',
            'username',
            'nickname',
            'phone',
            'email',
        ]);
    }
}
