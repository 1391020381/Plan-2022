import { forwardRef, Module } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';
import { UserModule } from '../user/user.module';

import * as controllerMaps from './controllers';
import * as EntityMaps from './entities';
import { RbacResolver } from './rbac.resolver';
import * as RepositoryMaps from './repositories';
import * as serviceMaps from './services';
import * as SubscriberMaps from './subscribers';

const entities = Object.values(EntityMaps);

const repositories = Object.values(RepositoryMaps);
const subscribers = Object.values(SubscriberMaps);
const services = Object.values(serviceMaps);

@Module({
    imports: [
        forwardRef(() => UserModule),
        addEntities(entities),
        DatabaseModule.forRepository(repositories),
    ],
    controllers: Object.values(controllerMaps),
    providers: [
        ...subscribers,
        ...services,
        {
            provide: RbacResolver,
            useFactory: async (dataSource: DataSource) => {
                const resolver = new RbacResolver(dataSource);
                resolver.setOptions({});
                return resolver;
            },
            inject: [getDataSourceToken()],
        },
    ],
    exports: [DatabaseModule.forRepository(repositories), RbacResolver, ...services],
})
export class RbacModule {}
