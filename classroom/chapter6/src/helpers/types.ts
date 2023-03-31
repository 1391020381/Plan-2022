import { QueueOptions as BullMQOptions } from 'bullmq';
import dayjs from 'dayjs';
import { RedisOptions as IoRedisOptions } from 'ioredis';
import { IPaginationMeta, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { OrderType } from './constants';

/**
 * Redis配置
 */
export type RedisOptions = IoRedisOptions | Array<RedisOption>;

/**
 * Redis连接配置
 */
export type RedisOption = Omit<IoRedisOptions, 'name'> & { name: string };

/**
 * BullMQ模块注册配置
 */
export type BullOptions = BullMQOptions | Array<{ name: string } & BullMQOptions>;

/**
 * 队列配置
 */
export type QueueOptions = QueueOption | Array<{ name: string } & QueueOption>;

/**
 * 队列项配置
 */
export type QueueOption = Omit<BullMQOptions, 'connection'> & { redis?: string };

/**
 * 时间配置
 */
export interface TimeOptions {
    date?: dayjs.ConfigType;
    format?: dayjs.OptionType;
    locale?: string;
    strict?: boolean;
    zonetime?: string;
}

/**
 * 排序类型,{字段名称: 排序方法}
 * 如果多个值则传入数组即可
 * 排序方法不设置,默认DESC
 */
export type OrderQueryType =
    | string
    | { name: string; order: `${OrderType}` }
    | Array<{ name: string; order: `${OrderType}` } | string>;

/**
 * 分页验证DTO接口
 */
export interface PaginateDto<C extends IPaginationMeta = IPaginationMeta>
    extends Omit<IPaginationOptions<C>, 'page' | 'limit'> {
    page: number;
    limit: number;
}
