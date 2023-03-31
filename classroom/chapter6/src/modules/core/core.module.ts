import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { isArray, omit, isNil } from 'lodash';
import { DataSource, ObjectType } from 'typeorm';

import { createQueueOptions, createRedisOptions } from '@/helpers';

import { AppFilter, AppIntercepter, AppPipe } from './app';
import { CUSTOM_REPOSITORY_METADATA } from './constants';
import {
    ModelExistConstraint,
    UniqueConstraint,
    UniqueExistContraint,
    UniqueTreeConstraint,
    UniqueTreeExistConstraint,
} from './constraints';
import { SmsService, SmtpService, RedisService } from './services';
import { CoreOptions } from './types';

export class CoreModule {
    /**
     * 注册Core模块
     * @param options
     */
    public static forRoot(options: CoreOptions = {}): DynamicModule {
        let imports: ModuleMetadata['imports'] = [];

        let providers: ModuleMetadata['providers'] = [
            {
                provide: APP_PIPE,
                useFactory: () =>
                    new AppPipe({
                        transform: true,
                        forbidUnknownValues: false,
                        validationError: { target: false },
                    }),
            },
            {
                provide: APP_FILTER,
                useClass: AppFilter,
            },
            {
                provide: APP_INTERCEPTOR,
                useClass: AppIntercepter,
            },
        ];

        const exps: ModuleMetadata['exports'] = [];

        if (options.database) {
            imports.push(TypeOrmModule.forRoot(options.database()));
            providers = [
                ...providers,
                ModelExistConstraint,
                UniqueConstraint,
                UniqueExistContraint,
                UniqueTreeConstraint,
                UniqueTreeExistConstraint,
            ];
        }
        if (options.redis) {
            const redis = createRedisOptions(options.redis());
            if (!isNil(redis)) {
                providers.push({
                    provide: RedisService,
                    useFactory: () => {
                        const service = new RedisService(redis);
                        service.createClients();
                        return service;
                    },
                });
                exps.push(RedisService);
                if (options.queue) {
                    const queue = createQueueOptions(options.queue(), redis);
                    if (!isNil(queue)) {
                        if (isArray(queue)) {
                            imports = queue.map((v) =>
                                BullModule.forRoot(v.name, omit(v, ['name'])),
                            );
                        } else {
                            imports.push(BullModule.forRoot(queue));
                        }
                    }
                }
            }
        }

        if (options.sms) {
            providers.push({
                provide: SmsService,
                useFactory: () => new SmsService(options.sms()),
            });
            exps.push(SmsService);
        }
        if (options.smtp) {
            providers.push({
                provide: SmtpService,
                useFactory: () => new SmtpService(options.smtp()),
            });
            exps.push(SmtpService);
        }
        return {
            global: true,
            imports,
            providers,
            exports: exps,
            module: CoreModule,
        };
    }

    /**
     * @description 注册自定义Repository
     * @static
     * @template T
     * @param {T[]} repositories 需要注册的自定义类列表
     * @param {string} [dataSourceName] 数据池名称,默认为默认连接
     */
    public static forRepository<T extends Type<any>>(
        repositories: T[],
        dataSourceName?: string,
    ): DynamicModule {
        const providers: Provider[] = [];

        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);

            if (!entity) {
                continue;
            }

            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (dataSource: DataSource): typeof Repo => {
                    const base = dataSource.getRepository<ObjectType<any>>(entity);
                    return new Repo(base.target, base.manager, base.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: CoreModule,
            providers,
        };
    }
}
