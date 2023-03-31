import { DynamicModule } from '@nestjs/common';

import { RestfulFactory } from './factory';
import { ApiConfig } from './types';

export class RestfulModule {
    static forRoot(options: () => ApiConfig): DynamicModule {
        const restful = new RestfulFactory();
        restful.create(options());
        return {
            global: true,
            imports: restful.getModuleImports(),
            providers: [
                {
                    provide: RestfulFactory,
                    useValue: restful,
                },
            ],
            exports: [RestfulFactory],
            module: RestfulModule,
        };
    }
}
