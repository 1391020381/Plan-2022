import { Injectable } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import chalk from 'chalk';
import { isNil } from 'lodash';

import { SAVE_MESSAGE_QUEUE } from '../constants';
import { MessageEntity, MessagerecevieEntity } from '../entities';

import { MessageRepository, RecevieRepository, UserRepository } from '../repositories';
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
    ) {}

    /**
     * 添加消费者
     */
    async addWorker() {
        return new Worker(
            SAVE_MESSAGE_QUEUE,
            async (job: Job<SaveMessageQueueJob>) => this.saveMessage(job),
            { concurrency: 10 },
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
