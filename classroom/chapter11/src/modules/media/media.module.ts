import { forwardRef } from '@nestjs/common';

import { ModuleBuilder } from '../core/decorators';
import { DatabaseModule } from '../database/database.module';
import { addEntities, addSubscribers } from '../database/helpers';
import { UserModule } from '../user/user.module';

import * as dtoMaps from './dtos';
import * as entityMaps from './entities';
import * as RepositoryMaps from './repositories';
import * as serviceMaps from './services';
import * as subscriberMaps from './subscribers';

const entities = Object.values(entityMaps);
const repositories = Object.values(RepositoryMaps);
const services = Object.values(serviceMaps);
const dtos = Object.values(dtoMaps);
const subscribers = Object.values(subscriberMaps);
@ModuleBuilder(async (configure) => ({
    imports: [
        await addEntities(configure, entities),
        DatabaseModule.forRepository(repositories),
        forwardRef(() => UserModule),
    ],
    providers: [...dtos, ...(await addSubscribers(configure, subscribers)), ...services],
    exports: [...services, DatabaseModule.forRepository(repositories)],
}))
export class MediaModule {}
