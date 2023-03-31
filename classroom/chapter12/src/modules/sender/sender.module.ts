import { ModuleMetadata } from '@nestjs/common';

import { ModuleBuilder } from '../core/decorators';

import { SmsService, SmtpService } from './services';
import { SmsConfig, SmtpConfig } from './types';

@ModuleBuilder(async (configure) => {
    /**
     * 添加配置实例为提供者
     */
    const providers: ModuleMetadata['providers'] = [];
    const exps: ModuleMetadata['exports'] = [];
    /**
     * 如果存在sms配置则添加SMS服务
     */
    if (configure.has('sms')) {
        providers.push({
            provide: SmsService,
            useFactory: async () => new SmsService(await configure.get<SmsConfig>('sms')),
        });
        exps.push(SmsService);
    }
    /**
     * 如果存在smtp配置则添加STMP服务
     */
    if (configure.has('smtp')) {
        providers.push({
            provide: SmtpService,
            useFactory: async () => new SmtpService(await configure.get<SmtpConfig>('smtp')),
        });
        exps.push(SmtpService);
    }
    return {
        global: true,
        providers,
        exports: exps,
    };
})
export class SenderModule {}
