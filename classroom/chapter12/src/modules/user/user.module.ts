import { forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ModuleBuilder } from '../core/decorators';
import { DatabaseModule } from '../database/database.module';
import { addEntities, addSubscribers } from '../database/helpers';

import { MediaModule } from '../media/media.module';
import { RbacModule } from '../rbac/rbac.module';

import * as dtoMaps from './dtos';
import * as entityMaps from './entities';
import { getWSProviders } from './getways';
import * as guardMaps from './guards';
import { getUserQueue } from './queue';
import { UserRbac } from './rbac';
import * as RepositoryMaps from './repositories';
import * as serviceMaps from './services';
import * as strategyMaps from './strategies';
import * as subscriberMaps from './subscribers';

const entities = Object.values(entityMaps);
const repositories = Object.values(RepositoryMaps);
const strategies = Object.values(strategyMaps);
const services = Object.values(serviceMaps);
const dtos = Object.values(dtoMaps);
const guards = Object.values(guardMaps);
const subscribers = Object.values(subscriberMaps);
@ModuleBuilder(async (configure) => {
    const queue = await getUserQueue(configure);
    return {
        imports: [
            await addEntities(configure, entities),
            DatabaseModule.forRepository(repositories),
            PassportModule,
            serviceMaps.AuthService.jwtModuleFactory(),
            forwardRef(() => RbacModule),
            forwardRef(() => MediaModule),
            ...queue.imports,
        ],
        providers: [
            ...(await addSubscribers(configure, subscribers)),
            ...dtos,
            ...guards,
            ...services,
            UserRbac,
            ...queue.providers,
            ...(await getWSProviders(configure)),
            ...strategies,
        ],
        exports: [...queue.providers, ...services, DatabaseModule.forRepository(repositories)],
    };
})
export class UserModule {}
