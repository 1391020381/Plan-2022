import { isNil, omit } from 'lodash';

import { QueueConfig, QueueConfigOptions, RedisOption } from '../types';

export type ConnectionOption<T extends Record<string, any>> = { name?: string } & T;
export type ConnectionRst<T extends Record<string, any>> = Array<{ name: string } & T>;

/**
 * 生成Typeorm,Redis等连接的配置
 * @param options
 */
export const createConnectionOptions = <T extends Record<string, any>>(
    options: ConnectionOption<T>,
): ConnectionRst<T> => {
    const config: ConnectionRst<T> = Array.isArray(options)
        ? options
        : [{ ...options, name: 'default' }];
    if (config.length <= 0) return undefined;
    if (isNil(config.find(({ name }) => name === 'default'))) {
        config[0].name = 'default';
    }
    return config.reduce((o, n) => {
        const names = o.map(({ name }) => name) as string[];
        return names.includes(n.name) ? o : [...o, n];
    }, []);
};

/**
 * 生成BullMQ模块的配置
 * @param options
 * @param redis
 */
export const createQueueOptions = (
    options: QueueConfigOptions,
    redis: Array<RedisOption>,
): QueueConfig | undefined => {
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
