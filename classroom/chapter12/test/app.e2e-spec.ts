/* eslint-disable jest/expect-expect */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import * as configs from '@/config';

import { ContentModule } from '@/modules/content/content.module';
import { App } from '@/modules/core/app';
import { createBootModule } from '@/modules/core/helpers/app';
import { RbacGuard } from '@/modules/rbac/guards';
import { RbacModule } from '@/modules/rbac/rbac.module';
import { UserModule } from '@/modules/user/user.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const configure = await App.buildConfigure(configs);
        const { BootModule } = await createBootModule(
            { configure },
            {
                modules: [UserModule, RbacModule, ContentModule],
                globals: { guard: RbacGuard },
            },
        );
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [BootModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
    });
});
