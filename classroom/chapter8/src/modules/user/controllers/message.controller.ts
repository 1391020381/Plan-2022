import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Query,
    SerializeOptions,
} from '@nestjs/common';

import { In } from 'typeorm';

import { ClassToPlain } from '@/modules/core/types';

import { Permission } from '@/modules/rbac/decorators';
import { checkOwner } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';

import { RecevierActionType } from '../constants';
import { ReqUser } from '../decorators';
import { QueryOwnerMessageDto, QueryReciveMessageDto, UpdateReceviesDto } from '../dtos';

import { UserEntity } from '../entities';
import { MessageRepository } from '../repositories';
import { MessageService } from '../services';

const senderChecker: PermissionChecker = async (ab, ref, request) =>
    checkOwner(
        ab,
        async (items) =>
            ref.get(MessageRepository, { strict: false }).find({
                relations: ['sender'],
                where: { id: In(items) },
            }),
        request,
        'sended-manage',
    );

const recevierChecker: PermissionChecker = async (ab, ref, request) =>
    checkOwner(
        ab,
        async (items) =>
            ref.get(MessageRepository, { strict: false }).find({
                relations: ['receives.recevier'],
                where: { id: In(items) },
            }),
        request,
        'recevied-manage',
    );
/**
 * 即时消息控制器
 */

@Controller('messages')
export class MessageController {
    constructor(protected messageService: MessageService) {}

    /**
     * 读取发送的消息列表
     * @param options
     * @param user
     */
    @Get('sendeds')
    async sendeds(
        @Query() options: QueryOwnerMessageDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.messageService.paginate({ ...options, sender: user.id } as any);
    }

    /**
     * 查看发送的消息
     * @param item
     */
    @Get('sendeds/:item')
    @Permission(senderChecker)
    async sended(
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.messageService.detail(item, false);
    }

    /**
     * 发送者删除已发送的消息
     * @param user
     * @param item
     */
    @Delete('sendeds/:item')
    @SerializeOptions({
        groups: ['message-detail'],
    })
    async deleteSended(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Param('item', new ParseUUIDPipe()) item: string,
    ) {
        return this.messageService.deleteSended(item, user.id);
    }

    /**
     * 发送者批量删除已发送的消息
     * @param user
     * @param data
     * @param query
     */
    @Delete('sendeds')
    @Permission(senderChecker)
    @SerializeOptions({
        groups: ['message-list'],
    })
    async deleteSendeds(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: UpdateReceviesDto,
        @Query() query: QueryOwnerMessageDto,
    ) {
        return this.messageService.deleteSendeds(data, user.id, query);
    }

    /**
     * 读取收到的消息列表
     * @param options
     * @param user
     */
    @Get('recevies')
    async recevies(
        @Query() options: QueryReciveMessageDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.messageService.paginate({ ...options, recevier: user.id } as any);
    }

    /**
     * 读取收到的消息或设置为已读状态
     * @param user
     * @param item
     */
    @Get('recevies/:item')
    @Permission(recevierChecker)
    @SerializeOptions({
        groups: ['message-detail'],
    })
    async recevie(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Param('item', new ParseUUIDPipe()) item: string,
    ) {
        return this.messageService.updateRecevie(item, RecevierActionType.READED, user.id);
    }

    /**
     * 批量设置一些收到的消息为已读状态
     * @param user
     * @param data
     * @param query
     */
    @Patch('readed')
    @Permission(recevierChecker)
    @SerializeOptions({
        groups: ['message-list'],
    })
    async readedMulti(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: UpdateReceviesDto,
        @Query() query: QueryReciveMessageDto,
    ) {
        return this.messageService.updateReceviesPaginate(
            data,
            RecevierActionType.READED,
            user.id,
            query,
        );
    }

    /**
     * 接收者删除收到的消息
     * @param user
     * @param item
     */
    @Delete('recevies/:item')
    @Permission(recevierChecker)
    @SerializeOptions({
        groups: ['message-detail'],
    })
    async deleteRecevie(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Param('item', new ParseUUIDPipe()) item: string,
    ) {
        return this.messageService.updateRecevie(item, RecevierActionType.DELETE, user.id);
    }

    /**
     * 接收者批量删除收到的消息
     * @param user
     * @param data
     * @param query
     */
    @Delete('recevies')
    @Permission(recevierChecker)
    @SerializeOptions({
        groups: ['message-list'],
    })
    async deleteRecevies(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: UpdateReceviesDto,
        @Query() query: QueryOwnerMessageDto,
    ) {
        return this.messageService.updateReceviesPaginate(
            data,
            RecevierActionType.DELETE,
            user.id,
            query,
        );
    }
}
