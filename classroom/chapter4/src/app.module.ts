import { Module } from '@nestjs/common';

import { database } from './config';
import { ContentModule } from './modules/content/content.module';
import { CoreModule } from './modules/core/core.module';

@Module({
    imports: [CoreModule.forRoot({ database: database() }), ContentModule],
})
export class AppModule {}
