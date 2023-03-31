import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '../core/core.module';

import { SEND_CAPTCHA_QUEUE } from './constants';

import * as controllerMaps from './controllers';
import * as dtoMaps from './dtos';
import * as entityMaps from './entities';
import * as guardMaps from './guards';
import { JwtAuthGuard } from './guards';
import * as queueMaps from './queue';
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
const controllers = Object.values(controllerMaps);
const queue = Object.values(queueMaps);
@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        CoreModule.forRepository(repositories),
        PassportModule,
        serviceMaps.AuthService.jwtModuleFactory(),
        BullModule.registerQueue({
            name: SEND_CAPTCHA_QUEUE,
        }),
    ],
    providers: [
        ...strategies,
        ...dtos,
        ...services,
        ...guards,
        ...subscribers,
        ...queue,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    controllers,
    exports: [...services, ...queue, CoreModule.forRepository(repositories)],
})
export class UserModule {}
