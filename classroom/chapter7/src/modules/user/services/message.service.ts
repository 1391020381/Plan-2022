import { Injectable, NotFoundException } from '@nestjs/common';

import { isNil, omit } from 'lodash';
import { In, SelectQueryBuilder, EntityNotFoundError } from 'typeorm';

import { BaseService } from '@/modules/core/crud';

import { QueryHook, QueryListParams } from '@/modules/core/types';

import { RecevierActionType } from '../constants';
import { UpdateReceviesDto, QueryMessageDto, QueryOwnerMessageDto } from '../dtos';
import { MessageEntity } from '../entities';
import { MessageRepository, RecevieRepository } from '../repositories';

/**
 * 消息服务
 */
@Injectable()
export class MessageService extends BaseService<MessageEntity, MessageRepository> {
    constructor(
        protected readonly messageRepository: MessageRepository,
        protected readonly recevieRepository: RecevieRepository,
    ) {
        super(messageRepository);
    }

    /**
     * 发送者删除已发送的消息
     * @param id
     * @param userId
     */
    async deleteSended(id: string, userId: string) {
        const message = await this.repository.findOne({
            relations: ['sender', 'recevies', 'recevies.recevier'],
            where: {
                id,
                sender: { id: userId },
            },
        });
        if (isNil(message)) {
            throw new EntityNotFoundError(MessageEntity, `message ${id} not exists!`);
        }
        await this.repository.remove(message);
        return message;
    }

    /**
     * 发送者批量删除已发送的消息
     * @param data
     * @param userId
     * @param options
     */
    async deleteSendeds(data: UpdateReceviesDto, userId: string, options: QueryOwnerMessageDto) {
        const messages = await this.repository.find({
            relations: ['sender', 'recevies', 'recevies.recevier'],
            where: {
                id: In(data.messages),
                sender: { id: userId },
            },
        });
        await this.repository.remove(messages);
        return this.paginate({ ...options, sender: userId } as any);
    }

    /**
     * 更改接收数据
     * 删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态
     * @param id 消息ID
     * @param type 操作类型
     * @param userId 当前用户ID
     */
    async updateRecevie(id: string, type: RecevierActionType, userId: string) {
        // await this.repository.findOneByOrFail({ id });
        const receviers = await this.updateRecevies([id], type, userId);
        if (receviers.length <= 0) {
            throw new NotFoundException('message not exits!');
        }
        return this.repository
            .buildBaseQuery()
            .leftJoinAndSelect(`${this.repository.getQBName()}.sender`, 'sender')
            .leftJoinAndMapOne(
                `${this.repository.getQBName()}.recevier`,
                `${this.repository.getQBName()}.recevies`,
                'recevie',
                'recevie.recevier = :recevier',
                {
                    recevier: userId,
                },
            )
            .leftJoin(`${this.repository.getQBName()}.recevies`, 'recevies')
            .andWhere('recevies.recevier = :recevier', {
                recevier: userId,
            })
            .getOne();
    }

    /**
     * 批量更改接收数据
     * 删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态
     * @param data 消息ID列表
     * @param type 操作类型
     * @param userId 当前用户ID
     * @param params 列表查询参数
     */
    async updateReceviesList(
        data: UpdateReceviesDto,
        type: RecevierActionType,
        userId: string,
        params: QueryMessageDto,
    ) {
        await this.updateRecevies(data.messages, type, userId);
        return this.list(omit(params, ['page', 'limit']) as any);
    }

    /**
     * 批量更改接收数据,返回分页后的消息列表
     * 返回分页后的消息列表，删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态
     * @param data 消息ID列表
     * @param type 操作类型
     * @param userId 当前用户ID
     * @param options 分页查询参数
     */
    async updateReceviesPaginate(
        data: UpdateReceviesDto,
        type: RecevierActionType,
        userId: string,
        options: QueryMessageDto,
    ) {
        await this.updateRecevies(data.messages, type, userId);
        return this.paginate({ ...options, recevier: userId } as any);
    }

    /**
     * 批量更改接收数据
     * 删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态的具体处理
     * @param data
     * @param action
     * @param userId
     */
    protected async updateRecevies(data: string[], action: RecevierActionType, userId: string) {
        const receviers = await this.recevieRepository.find({
            relations: { message: true, recevier: true },
            where: {
                message: { id: In(data) },
                recevier: { id: userId },
            },
        });
        for (const recevier of receviers) {
            if (action === RecevierActionType.READED && !recevier.readed) {
                recevier.readed = true;
                await recevier.save({ reload: true });
            }
            if (action === RecevierActionType.DELETE) {
                this.recevieRepository.remove(recevier);
            }
        }
        return receviers;
    }

    /**
     * 重载项目查询方法
     * @param qb
     * @param callback
     */
    protected async buildItemQuery(
        qb: SelectQueryBuilder<MessageEntity>,
        callback?: QueryHook<MessageEntity>,
    ) {
        return super.buildItemQuery(qb, async (q) => {
            return q
                .leftJoinAndSelect(`${this.repository.getQBName()}.recevies`, 'receviers')
                .leftJoinAndSelect(`${this.repository.getQBName()}.sender`, 'sender');
        });
    }

    /**
     * 重载列表查询方法
     * @param qb
     * @param options
     * @param callback
     */
    protected async buildListQuery(
        qb: SelectQueryBuilder<MessageEntity>,
        options: QueryListParams<MessageEntity> & {
            readed?: boolean;
            recevier?: string;
            sender?: string;
        },
        callback?: QueryHook<MessageEntity>,
    ) {
        return super.buildListQuery(qb, options, async (q) => {
            q.leftJoinAndSelect(`${this.repository.getQBName()}.sender`, 'sender');
            if (!isNil(options.recevier)) {
                q.leftJoinAndMapOne(
                    `${this.repository.getQBName()}.recevier`,
                    `${this.repository.getQBName()}.recevies`,
                    'recevie',
                    'recevie.recevier = :recevier',
                    {
                        recevier: options.recevier,
                    },
                )
                    .leftJoin(`${this.repository.getQBName()}.recevies`, 'recevies')
                    .andWhere('recevies.recevier = :recevier', {
                        recevier: options.recevier,
                    });
                if (typeof options.readed === 'boolean') {
                    q.andWhere('recevies.readed = :readed', {
                        readed: options.readed,
                    });
                }
            } else {
                q.leftJoinAndSelect(
                    `${this.repository.getQBName()}.recevies`,
                    'receviers',
                ).leftJoinAndSelect('receviers.recevier', 'recevier');
                if (!isNil(options.sender)) {
                    q.andWhere(`${this.repository.getQBName()}.sender = :sender`, {
                        sender: options.sender,
                    });
                }
            }

            return q;
        });
    }
}
