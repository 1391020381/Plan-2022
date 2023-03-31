import { Injectable } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import chalk from 'chalk';
import { isNil } from 'lodash';

import { Configure } from '@/modules/core/configure';

import { RedisConfig } from '@/modules/redis/types';

import { SAVE_MESSAGE_QUEUE } from '../constants';
import { MessageEntity } from '../entities/message.entity';
import { MessagerecevieEntity } from '../entities/recevie.entity';
import { MessageRepository } from '../repositories/message.repository';
import { RecevieRepository } from '../repositories/recevie.repository';
import { UserRepository } from '../repositories/user.repository';
import { SaveMessageQueueJob } from '../types';

/**
 * 保存消息消费者
 */
@Injectable()
export class MessageWorker {
    constructor(
        protected messageRepository: MessageRepository,
        protected userRepository: UserRepository,
        protected recevieRepostiroy: RecevieRepository,
        protected configure: Configure,
    ) {}

    /**
     * 添加消费者
     */
    async addWorker() {
        const redisConf = (await this.configure.get<RedisConfig>('redis')) ?? [];
        const connection = redisConf.find(({ name }) => name === 'default');
        return new Worker(
            SAVE_MESSAGE_QUEUE,
            async (job: Job<SaveMessageQueueJob>) => this.saveMessage(job),
            { concurrency: 10, connection },
        );
    }

    /**
     * 保存消息
     * @param job
     */
    protected async saveMessage(job: Job<SaveMessageQueueJob>) {
        const { title, body, type, sender, receviers } = job.data;
        try {
            const message = new MessageEntity();
            message.title = title;
            message.body = body;
            if (!isNil(type)) message.type = type;
            message.sender = await this.userRepository.findOneByOrFail({ id: sender });
            await message.save({ reload: true });
            await this.recevieRepostiroy.save(
                await Promise.all(
                    receviers.map(async (r) => {
                        const recevie = new MessagerecevieEntity();
                        recevie.message = message;
                        recevie.recevier = await this.userRepository.findOneByOrFail({ id: r });
                        recevie.save({ reload: true });
                        return recevie;
                    }),
                ),
            );
        } catch (err) {
            console.log(chalk.red(err));
            throw new Error(err as string);
        }
    }
}
