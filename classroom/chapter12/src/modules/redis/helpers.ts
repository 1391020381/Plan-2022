import { createConnectionOptions } from '../core/helpers';
import { ConfigureFactory, ConfigureRegister, RePartial } from '../core/types';

import { RedisConfig, RedisConfigOptions } from './types';

export const createRedisConfig: (
    register: ConfigureRegister<RePartial<RedisConfigOptions>>,
) => ConfigureFactory<RedisConfigOptions, RedisConfig> = (register) => ({
    register,
    hook: (configure, value) => createConnectionOptions(value),
    defaultRegister: (configure) => ({
        host: configure.env('REDIS_HOST', '127.0.0.1'),
        port: configure.env<number>('REDIS_PORT', 6379),
    }),
});
