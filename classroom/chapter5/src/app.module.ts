import { Module } from '@nestjs/common';

import { database } from './config';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [CoreModule.forRoot({ database: database() }), UserModule, ContentModule],
})
export class AppModule {}
