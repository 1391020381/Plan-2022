import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { SAVE_MESSAGE_QUEUE } from '../constants';
import { SaveMessageQueueJob } from '../types';

import { MessageWorker } from './message.worker';

/**
 * 消息保存服务
 */
@Injectable()
export class MessageJob {
    constructor(
        @InjectQueue(SAVE_MESSAGE_QUEUE) protected messageQueue: Queue,
        protected worker: MessageWorker,
    ) {
        this.worker.addWorker();
    }

    /**
     * 保存消息
     * @param params
     */
    async save(params: SaveMessageQueueJob) {
        try {
            await this.messageQueue.add('save-message', params);
        } catch (err) {
            throw new BadRequestException(err);
        }
        return { result: true };
    }
}
