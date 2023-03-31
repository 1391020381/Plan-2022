import { env, getRunEnv } from '@/helpers';
import { EnvironmentType } from '@/helpers/constants';
import { UserConfig } from '@/modules/user/types';

const expiredTime = getRunEnv() === EnvironmentType.DEVELOPMENT ? 3600 * 10000 : 3600;

/**
 * 用户模块配置
 */
export const userConfig: () => UserConfig = () => ({
    hash: 10,
    jwt: {
        secret: 'my-secret',
        token_expired: expiredTime,
        refresh_secret: 'my-refresh-secret',
        refresh_token_expired: expiredTime * 30,
    },
    captcha: {
        sms: {
            login: {
                template: env('SMS_LOGIN_CAPTCHA_QCLOUD', 'your-id'),
            },
            register: {
                template: env('SMS_REGISTER_CAPTCHA_QCLOUD', 'your-id'),
            },
            'retrieve-password': {
                template: env('SMS_RETRIEVEPASSWORD_CAPTCHA_QCLOUD', 'your-id'),
            },
        },
        email: {
            register: {},
            'retrieve-password': {},
        },
    },
});
