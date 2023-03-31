import { RedisOptions } from '@/helpers/types';

export const redis: () => RedisOptions = () => ({
    host: 'localhost',
    port: 6379,
});
