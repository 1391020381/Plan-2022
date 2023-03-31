import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { CoreModule } from '../core/core.module';
import { UserModule } from '../user/user.module';

import * as controllerMaps from './controllers';
import * as EntityMaps from './entities';
import { RbacGuard } from './guards';
import * as RepositoryMaps from './repositories';
import { RbacResolver } from './resolver';
import * as serviceMaps from './services';
import * as SubscriberMaps from './subscribers';

const entities = Object.values(EntityMaps);

const repositories = Object.values(RepositoryMaps);
const subscribers = Object.values(SubscriberMaps);
const services = Object.values(serviceMaps);
const controllers = Object.values(controllerMaps);

@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature(entities),
        CoreModule.forRepository(repositories),
    ],
    controllers,
    providers: [
        ...subscribers,
        ...services,
        {
            provide: APP_GUARD,
            useClass: RbacGuard,
        },
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
    exports: [CoreModule.forRepository(repositories), RbacResolver, ...services],
})
export class RbacModule {}
