import { ModuleMetadata } from '@nestjs/common';

import { ModuleBuilder } from '../core/decorators';
import { DatabaseModule } from '../database/database.module';
import { addEntities, addSubscribers } from '../database/helpers';
import { RbacModule } from '../rbac/rbac.module';
import { UserModule } from '../user/user.module';

import * as DtoMaps from './dtos';
import * as EntityMaps from './entities';
import { ContentRbac } from './rbac';
import * as RepositoryMaps from './repositories';
import * as ServerMaps from './services';
import { SanitizeService } from './services/sanitize.service';
import { PostSearchService } from './services/search.service';
import * as SubscriberMaps from './subscribers';
import { PostTypeOption } from './types';

const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const subscribers = Object.values(SubscriberMaps);
const dtos = Object.values(DtoMaps);
const services = Object.values(ServerMaps) as ModuleMetadata['providers'];
@ModuleBuilder(async (configure) => {
    if (configure.has('elastic') && (await configure.get<boolean>('content.elastic', false))) {
        services.push(PostSearchService);
    }
    const postType = await configure.get<PostTypeOption>('content.postType', 'all');
    if (postType === 'html' || postType === 'all') {
        services.push(SanitizeService);
    }
    return {
        imports: [
            UserModule,
            RbacModule,
            await addEntities(configure, entities),
            // 注册自定义Repository
            DatabaseModule.forRepository(repositories),
        ],
        providers: [
            ...(await addSubscribers(configure, subscribers)),
            ...dtos,
            ...services,
            ContentRbac,
        ],
        exports: [
            // 导出自定义Repository,以供其它模块使用
            DatabaseModule.forRepository(repositories),
            ...services,
        ],
    };
})
export class ContentModule {}
