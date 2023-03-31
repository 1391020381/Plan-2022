import { forwardRef, ModuleMetadata } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ModuleBuilder } from '../core/decorators';
import { DatabaseModule } from '../database/database.module';
import { addEntities, addSubscribers } from '../database/helpers';
import { UserModule } from '../user/user.module';

import * as EntityMaps from './entities';
import { RbacResolver } from './rbac.resolver';
import * as RepositoryMaps from './repositories';
import * as serviceMaps from './services';
import * as SubscriberMaps from './subscribers';

const entities = Object.values(EntityMaps);

const repositories = Object.values(RepositoryMaps);
const subscribers = Object.values(SubscriberMaps);
const services = Object.values(serviceMaps);

@ModuleBuilder(
    async (configure) =>
        ({
            imports: [
                forwardRef(() => UserModule),
                await addEntities(configure, entities),
                DatabaseModule.forRepository(repositories),
            ],
            providers: [
                ...(await addSubscribers(configure, subscribers)),
                ...services,
                {
                    provide: RbacResolver,
                    useFactory: async (dataSource: DataSource) => {
                        const resolver = new RbacResolver(dataSource, configure);
                        resolver.setOptions({});
                        return resolver;
                    },
                    inject: [getDataSourceToken()],
                },
            ],
            exports: [DatabaseModule.forRepository(repositories), RbacResolver, ...services],
        } as ModuleMetadata),
)
export class RbacModule {}
