import { isNil, omit } from 'lodash';

import { BullOptions, QueueOptions, RedisOption, RedisOptions } from './types';
/**
 * 生成Redis配置
 * @param options
 */
export const createRedisOptions = (options: RedisOptions) => {
    const config: Array<RedisOption> = Array.isArray(options)
        ? options
        : [{ ...options, name: 'default' }];
    if (config.length <= 0) return undefined;
    if (isNil(config.find(({ name }) => name === 'default'))) {
        config[0].name = 'default';
    }
    return config.reduce<RedisOption[]>((o, n) => {
        const names = o.map(({ name }) => name) as string[];
        return names.includes(n.name) ? o : [...o, n];
    }, []);
};

/**
 * 生成BullMQ模块的peizhi
 * @param options
 * @param redis
 */
export const createQueueOptions = (
    options: QueueOptions,
    redis: Array<RedisOption>,
): BullOptions | undefined => {
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
