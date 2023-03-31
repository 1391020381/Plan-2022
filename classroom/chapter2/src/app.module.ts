import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './modules/core/core.module';
import { ForumModule } from './modules/forum/forum.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        CoreModule.forRoot({ title: '全局模块测试' }),
        ForumModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
