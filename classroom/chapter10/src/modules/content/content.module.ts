import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';
import { RbacModule } from '../rbac/rbac.module';
import { UserModule } from '../user/user.module';

import * as DtoMaps from './dtos';
import * as EntityMaps from './entities';
import { ContentRbac } from './rbac';
import * as RepositoryMaps from './repositories';
import * as ServerMaps from './services';
import * as SubscriberMaps from './subscribers';

const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const subscribers = Object.values(SubscriberMaps);
const dtos = Object.values(DtoMaps);
const services = Object.values(ServerMaps);
@Module({
    imports: [
        UserModule,
        RbacModule,
        addEntities(entities),
        // 注册自定义Repository
        DatabaseModule.forRepository(repositories),
    ],
    providers: [...subscribers, ...dtos, ...services, ContentRbac],
    exports: [
        // 导出自定义Repository,以供其它模块使用
        DatabaseModule.forRepository(repositories),
        ...services,
    ],
})
export class ContentModule {}
