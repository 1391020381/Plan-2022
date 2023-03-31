import { Injectable, NotFoundException } from '@nestjs/common';

import { isNil } from 'lodash';
import { In, SelectQueryBuilder } from 'typeorm';

import { BaseService } from '@/modules/database/base';
import { QueryHook, ServiceListQueryParams } from '@/modules/database/types';

import { RecevierActionType } from '../constants';
import { UpdateReceviesDto } from '../dtos/message.dto';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repositories/message.repository';
import { RecevieRepository } from '../repositories/recevie.repository';

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
     * 发送者批量删除已发送的消息
     * @param data
     * @param userId
     */
    async deleteSendeds(data: UpdateReceviesDto, userId: string) {
        const messages = await this.repository.find({
            relations: ['sender', 'recevies', 'recevies.recevier'],
            where: {
                id: In(data.messages),
                sender: { id: userId },
            },
        });
        return this.repository.remove(messages);
    }

    /**
     * 更改接收数据
     * 删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态
     * @param id 消息ID
     * @param type 操作类型
     * @param userId 当前用户ID
     */
    async updateRecevie(id: string, type: RecevierActionType, userId: string) {
        await this.repository.findOneByOrFail({ id });
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
     * 删除消息接收者与消息的关联(即接收者删除该消息)/更改已读状态的具体处理
     * @param data
     * @param action
     * @param userId
     */
    async updateRecevies(data: string[], action: RecevierActionType, userId: string) {
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
        options: ServiceListQueryParams<MessageEntity> & {
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
