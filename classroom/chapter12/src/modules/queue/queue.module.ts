import { BullModule } from '@nestjs/bullmq';
import { isArray, omit } from 'lodash';

import { ModuleBuilder } from '../core/decorators';

import { QueueConfig } from './types';

@ModuleBuilder(async (configure) => {
    const queue = await configure.get<QueueConfig>('queue');
    return {
        global: true,
        imports: isArray(queue)
            ? queue.map((v) => BullModule.forRoot(v.name, omit(v, ['name'])))
            : [BullModule.forRoot(queue)],
    };
})
export class QueueModule {}
