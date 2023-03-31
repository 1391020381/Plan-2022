import { createConnectionOptions } from '@/modules/core/helpers/options';
import { CoreOptions } from '@/modules/core/types';

export const redis: CoreOptions['redis'] = () =>
    createConnectionOptions({
        host: 'localhost',
        port: 6379,
    });
