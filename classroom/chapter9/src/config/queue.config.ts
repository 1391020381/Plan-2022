import { createQueueOptions } from '@/modules/core/helpers/options';
import { CoreOptions } from '@/modules/core/types';

export const queue: CoreOptions['queue'] = (redis) =>
    createQueueOptions(
        {
            redis: 'default',
        },
        redis,
    );
