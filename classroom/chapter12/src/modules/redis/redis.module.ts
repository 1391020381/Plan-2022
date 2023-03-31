import { ModuleBuilder } from '../core/decorators';

import { RedisService } from './services';
import { RedisOption } from './types';

@ModuleBuilder(async (configure) => ({
    global: true,
    providers: [
        {
            provide: RedisService,
            useFactory: async () => {
                const service = new RedisService(await configure.get<RedisOption[]>('redis'));
                service.createClients();
                return service;
            },
        },
    ],
    exports: [RedisService],
}))
export class RedisModule {}
