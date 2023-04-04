import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { bootApp, createApp } from '@/modules/core/helpers/app';

import * as configs from './config';

import { ContentModule } from './modules/content/content.module';
import { echoApi } from './modules/restful/helpers';
import { Restful } from './modules/restful/restful';

const creator = createApp({
    configs,
    configure: { storage: true },
    modules: [ContentModule],
    builder: async ({ configure, BootModule }) => {
        return NestFactory.create<NestFastifyApplication>(BootModule, new FastifyAdapter(), {
            cors: true,
            logger: ['error', 'warn'],
        });
    },
});
bootApp(creator, ({ app, configure }) => async () => {
    const restful = app.get(Restful);
    echoApi(configure, restful);
});
