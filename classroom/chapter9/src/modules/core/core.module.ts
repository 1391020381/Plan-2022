import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, ModuleMetadata } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { isArray, isNil, omit } from 'lodash';

import { DatabaseModule } from '../database/database.module';

import { SmsService, SmtpService, RedisService } from './providers';
import { CoreOptions } from './types';
/**
 * 全局核心模块
 */
export class CoreModule {
    static forRoot(options: CoreOptions = {}): DynamicModule {
        let imports: ModuleMetadata['imports'] = [];

        const providers: ModuleMetadata['providers'] = [];

        const exps: ModuleMetadata['exports'] = [];

        if (options.database) {
            imports.push(DatabaseModule.forRoot(options.database));
        }
        /**
         * 如果有Redis配置则添加Redis服务
         */
        if (!isNil(options.redis)) {
            const redis = options.redis();
            providers.push({
                provide: RedisService,
                useFactory: () => {
                    const service = new RedisService(redis);
                    service.createClients();
                    return service;
                },
            });
            exps.push(RedisService);
            /**
             * 如果有列队配置则添加列队服务
             */
            if (!isNil(options.queue)) {
                const queue = options.queue(redis);
                if (isArray(queue)) {
                    imports = queue.map((v) => BullModule.forRoot(v.name, omit(v, ['name'])));
                } else {
                    imports.push(BullModule.forRoot(queue));
                }
            }
        }
        /**
         * 如果存在sms配置则添加SMS服务
         */
        if (options.sms()) {
            providers.push({
                provide: SmsService,
                useFactory: () => new SmsService(options.sms()),
            });
            exps.push(SmsService);
        }
        /**
         * 如果存在smtp配置则添加STMP服务
         */
        if (options.smtp) {
            providers.push({
                provide: SmtpService,
                useFactory: () => new SmtpService(options.smtp()),
            });
            exps.push(SmtpService);
        }
        /**
         * 如果存在es配置则提交Elasticsearch服务
         */
        if (options.es) {
            imports.push(ElasticsearchModule.register(options.es()));
            exps.push(ElasticsearchModule);
        }
        return {
            global: true,
            module: CoreModule,
            imports,
            providers,
            exports: exps,
        };
    }
}
