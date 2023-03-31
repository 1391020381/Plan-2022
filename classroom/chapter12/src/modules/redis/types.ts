import { RedisOptions as IoRedisOptions } from 'ioredis';
/**
 * Redis配置,通过createConnectionOptions函数生成
 */
export type RedisConfig = RedisOption[];

/**
 * 自定义Redis配置
 */
export type RedisConfigOptions = IoRedisOptions | IoRedisOptions[];

/**
 * Redis连接配置项
 */
export type RedisOption = Omit<IoRedisOptions, 'name'> & { name: string };
