import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';
import { UserModule } from '../user/user.module';

import * as ControllerMaps from './controllers';
import * as DtoMaps from './dtos';
import * as EntityMaps from './entities';
import * as RepositoryMaps from './repositories';
import * as ServerMaps from './services';
import * as SubscriberMaps from './subscribers';

const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const subscribers = Object.values(SubscriberMaps);
const dtos = Object.values(DtoMaps);
const services = Object.values(ServerMaps);
const controllers = Object.values(ControllerMaps);
@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature(entities),
        // 注册自定义Repository
        CoreModule.forRepository(repositories),
    ],
    controllers,
    providers: [...subscribers, ...dtos, ...services],
    exports: [
        // 导出自定义Repository,以供其它模块使用
        CoreModule.forRepository(repositories),
        ...services,
    ],
})
export class ContentModule {}
