import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { database, queue, sms, smtp, redis, es } from '@/config';

import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';
import { AppFilter, AppIntercepter, AppPipe } from './modules/core/providers';
import { MediaModule } from './modules/media/media.module';
import { RbacGuard } from './modules/rbac/guards';
import { RbacModule } from './modules/rbac/rbac.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        CoreModule.forRoot({ database, queue, sms, smtp, redis, es }),
        MediaModule,
        UserModule,
        RbacModule,
        ContentModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useFactory: () =>
                new AppPipe({
                    transform: true,
                    forbidUnknownValues: false,
                    validationError: { target: false },
                }),
        },
        {
            provide: APP_FILTER,
            useClass: AppFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
        {
            provide: APP_GUARD,
            useClass: RbacGuard,
        },
    ],
})
export class AppModule {}
