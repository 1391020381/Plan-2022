import { createConnectionOptions } from '@/modules/core/helpers';
import { ConfigureFactory, RedisConfig, RedisConfigOptions } from '@/modules/core/types';

export const redis: ConfigureFactory<RedisConfigOptions, RedisConfig> = {
    register: () => ({
        host: 'localhost',
        port: 6379,
    }),
    hook: (configure, value) => createConnectionOptions(value),
};
