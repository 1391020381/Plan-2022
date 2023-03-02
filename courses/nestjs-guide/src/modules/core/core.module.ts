import { DynamicModule } from '@nestjs/common';

import { CommonService } from './services/common.service';

export class CoreModule {
    static forRoot(options: { title: string }): DynamicModule {
        return {
            module: CoreModule,
            global: true,
            providers: [
                {
                    provide: CommonService,
                    useFactory() {
                        const common = new CommonService(options);
                        return common;
                    },
                },
            ],
            exports: [CommonService],
        };
    }
}
