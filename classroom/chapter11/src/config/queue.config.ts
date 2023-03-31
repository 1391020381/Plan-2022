import { createQueueOptions } from '@/modules/core/helpers';
import { QueueConfigOptions, ConfigureFactory, RedisConfig } from '@/modules/core/types';

export const queue: ConfigureFactory<QueueConfigOptions> = {
    register: () => ({
        redis: 'default',
    }),
    hook: async (configure, value) =>
        createQueueOptions(value, await configure.get<RedisConfig>('redis')),
};
