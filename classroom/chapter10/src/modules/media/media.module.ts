import { forwardRef, Global, Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';
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

@Global()
@Module({
    imports: [
        addEntities(entities),
        DatabaseModule.forRepository(repositories),
        forwardRef(() => UserModule),
    ],
    providers: [...dtos, ...subscribers, ...services],
    exports: [...services, DatabaseModule.forRepository(repositories)],
})
export class MediaModule {}
