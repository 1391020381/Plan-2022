import { QueueOptions as BullMQOptions } from 'bullmq';
/**
 * 队列配置,通过createQueueOptions函数生成
 */
export type QueueConfig = BullMQOptions | Array<{ name: string } & BullMQOptions>;

/**
 * 自定义队列配置
 */
export type QueueConfigOptions = QueueOption | Array<{ name: string } & QueueOption>;

/**
 * 队列项配置
 */
export type QueueOption = Omit<BullMQOptions, 'connection'> & { redis?: string };
