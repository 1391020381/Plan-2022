import { resolve } from 'path';

import { isNil, toNumber } from 'lodash';

import { toBoolean } from '../core/helpers';
import { ConfigureFactory, ConfigureRegister } from '../core/types';

import { SmsConfig, SmtpConfig } from './types';

export const createSmsConfig: (
    register: ConfigureRegister<Partial<SmsConfig>>,
) => ConfigureFactory<Partial<SmsConfig>, SmsConfig> = (register) => ({
    register,
    defaultRegister: (configure) => ({
        sign: configure.env('SMS_QCLOUD_SIGN', 'your-sign'),
        region: configure.env('SMS_QCLOUD_REGION', 'ap-guangzhou'),
        appid: configure.env('SMS_QCLOUD_APPID', 'your-app-id'),
        secretId: configure.env('SMS_QCLOUD_ID', 'your-secret-id'),
        secretKey: configure.env('SMS_QCLOUD_KEY', 'your-secret-key'),
    }),
    storage: true,
});

export const createSmtpConfig: (
    register: ConfigureRegister<Partial<SmtpConfig>>,
) => ConfigureFactory<Partial<SmtpConfig>, SmtpConfig> = (register) => ({
    register,
    defaultRegister: (configure) => {
        const config: SmtpConfig = {
            host: configure.env('SMTP_HOST', 'your-smtp-host'),
            user: configure.env('SMTP_USER', 'your-smtp-username'),
            password: configure.env('SMTP_PASSWORD', 'your-smtp-password'),
            secure: configure.env<boolean>('SMTP_SECURE', (v) => toBoolean(v), false),
            from: configure.env('SMTP_FROM', undefined),
            // Email模板路径
            resource: resolve(__dirname, '../../assets/emails'),
        };
        if (isNil(config.from)) config.from = configure.env('SMTP_FROM', config.user);
        config.port = config.secure
            ? configure.env<number>('SMTP_PORT', (v) => toNumber(v), 443)
            : configure.env<number>('SMTP_PORT', (v) => toNumber(v), 25);
        return config;
    },
    storage: true,
});
