import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';

import { MediaModule } from '../media/media.module';
import { RbacModule } from '../rbac/rbac.module';

import { SEND_CAPTCHA_QUEUE, SAVE_MESSAGE_QUEUE } from './constants';

import * as ControllerMaps from './controllers';
import * as ManageControllerMaps from './controllers/manage';
import * as dtoMaps from './dtos';
import * as entityMaps from './entities';
import { MessageGateway } from './getways/ws.gateway';
import * as guardMaps from './guards';
import * as queueMaps from './queue';
import { UserRbac } from './rbac';
import * as RepositoryMaps from './repositories';
import * as serviceMaps from './services';
import * as strategyMaps from './strategies';
import * as subscriberMaps from './subscribers';

const controllers = [...Object.values(ControllerMaps), ...Object.values(ManageControllerMaps)];
const entities = Object.values(entityMaps);
const repositories = Object.values(RepositoryMaps);
const strategies = Object.values(strategyMaps);
const services = Object.values(serviceMaps);
const dtos = Object.values(dtoMaps);
const guards = Object.values(guardMaps);
const subscribers = Object.values(subscriberMaps);
const queue = Object.values(queueMaps);

@Module({
    imports: [
        addEntities(entities),
        DatabaseModule.forRepository(repositories),
        PassportModule,
        serviceMaps.AuthService.jwtModuleFactory(),
        BullModule.registerQueue({
            name: SEND_CAPTCHA_QUEUE,
        }),
        BullModule.registerQueue({
            name: SAVE_MESSAGE_QUEUE,
        }),
        forwardRef(() => RbacModule),
        forwardRef(() => MediaModule),
    ],
    controllers,
    providers: [
        ...strategies,
        ...dtos,
        ...subscribers,
        ...guards,
        ...services,
        ...queue,
        MessageGateway,
        UserRbac,
    ],
    exports: [...services, ...queue, DatabaseModule.forRepository(repositories)],
})
export class UserModule {}
