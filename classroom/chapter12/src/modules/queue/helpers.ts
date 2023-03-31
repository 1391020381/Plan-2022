import { isNil, omit } from 'lodash';

import { ConfigureFactory, ConfigureRegister } from '../core/types';

import { RedisConfig, RedisOption } from '../redis/types';

import { QueueConfig, QueueConfigOptions } from './types';

export const createQueueConfig: (
    register: ConfigureRegister<QueueConfigOptions>,
) => ConfigureFactory<QueueConfigOptions, QueueConfig | undefined> = (register) => ({
    register,
    hook: async (configure, value) =>
        createQueueOptions(value, await configure.get<RedisConfig>('redis')),
    defaultRegister: (configure) => ({
        redis: configure.env('QUEUE_REDIS_NAME', 'default'),
    }),
});

/**
 * 生成BullMQ模块的配置
 * @param options
 * @param redis
 */
export const createQueueOptions = async (
    options: QueueConfigOptions,
    redis: Array<RedisOption> | undefined,
): Promise<QueueConfig | undefined> => {
    if (isNil(redis)) return undefined;
    const names = redis.map(({ name }) => name);
    if (redis.length <= 0 && !names.includes('default')) return undefined;
    if (!Array.isArray(options)) {
        return {
            ...omit(options, 'redis'),
            connection: redis.find(({ name: c }) => c === options.redis ?? 'default'),
        };
    }
    return options.map(({ name, redis: r }) => ({
        name,
        ...omit(options, 'redis'),
        connection: redis.find(({ name: c }) => c === r ?? 'default'),
    }));
};
