import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '../database/database.module';

import { PostController } from './controllers';

import { PostEntity } from './entities';
import { PostRepository } from './repositories';
import { SanitizeService } from './services';
import { PostService } from './services/post.service';
import { PostSubscriber } from './subscribers';

@Module({
    // 导入模块的列表，这些模块 导出了此模块中所需的提供者
    imports: [
        // 此模块使用 forFeature() 方法定义在当前范围中注册哪些存储库。
        // 这样,我们就使用 @InjectRepository() 装饰器将 PostEntity注入到 Service
        // https://docs.nestjs.cn/9/techniques?id=%e6%95%b0%e6%8d%ae%e5%ba%93
        TypeOrmModule.forFeature([PostEntity]),
        DatabaseModule.forRepository([PostRepository]),
    ],
    controllers: [PostController],
    providers: [PostService, SanitizeService, PostSubscriber],
    // 由本模块提供并应用在其他模块中可用的提供者的子集
    exports: [PostService, DatabaseModule.forRepository([PostRepository])],
})
export class ContentModule {}
