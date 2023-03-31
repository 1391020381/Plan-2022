import { QueueOptions } from '@/helpers/types';

export const queue: () => QueueOptions = () => ({
    redis: 'default',
});
