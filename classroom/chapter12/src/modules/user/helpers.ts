import { resolve } from 'path';

import bcrypt from 'bcrypt';
import { isNil, toNumber } from 'lodash';

import { App } from '../core/app';

import { Configure } from '../core/configure';

import { ConfigureFactory, ConfigureRegister, RePartial } from '../core/types';

import { UserConfig } from './types';

export const createUserConfig: (
    register: ConfigureRegister<RePartial<UserConfig>>,
) => ConfigureFactory<UserConfig> = (register) => ({
    register,
    defaultRegister: defaultUserConfig,
});

/**
 * 获取user模块配置的值
 * @param key
 */
export async function getUserConfig<T>(key?: string): Promise<T> {
    return App.configure.get<T>(isNil(key) ? 'user' : `user.${key}`);
}

/**
 * 生成随机验证码
 */
export function generateCatpchaCode() {
    return Math.random().toFixed(6).slice(-6);
}

/**
 * 加密明文密码
 * @param password
 */
export const encrypt = async (password: string) => {
    return bcrypt.hashSync(password, await getUserConfig<number>('hash'));
};

/**
 * 验证密码
 * @param password
 * @param hashed
 */
export const decrypt = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
};

/**
 * 默认用户配置
 */
export const defaultUserConfig = (configure: Configure): UserConfig => {
    const captchaTime = {
        limit: configure.env('USER_CAPTCHA_LIMIT', (v) => toNumber(v), 60),
        expired: configure.env('USER_CAPTCHA_EXPIRED', (v) => toNumber(v), 1800),
    };
    return {
        enables: [],
        super: {
            username: configure.env('SUPER_ADMIN_USERNAME', 'admin'),
            password: configure.env('SUPER_ADMIN_PASSWORD', '123456aA$'),
        },
        hash: 10,
        avatar: resolve(__dirname, '../../assets/media', 'avatar.png'),
        jwt: {
            secret: configure.env('USER_TOKEN_SECRET', 'my-refresh-secret'),
            token_expired: configure.env('USER_TOKEN_EXPIRED', (v) => toNumber(v), 3600),
            refresh_secret: configure.env('USER_REFRESH_TOKEN_SECRET', 'my-refresh-secret'),
            refresh_token_expired: configure.env(
                'USER_REFRESH_TOKEN_EXPIRED',
                (v) => toNumber(v),
                3600 * 30,
            ),
        },
        captcha: {
            phone: {
                login: {
                    template: configure.env('USER_PHONE_QCLOOUD_LOGIN_CAPTCHA', 'template-id'),
                    ...captchaTime,
                },
                register: {
                    template: configure.env('USER_PHONE_QCLOOUD_REGISTER_CAPTCHA', 'template-id'),
                    ...captchaTime,
                },
                'retrieve-password': {
                    template: configure.env(
                        'USER_PHONE_QCLOOUD_RETRIEVEPASSWORD_CAPTCHA',
                        'template-id',
                    ),
                    ...captchaTime,
                },
                'reset-password': {
                    template: configure.env(
                        'USER_PHONE_QCLOOUD_RESETPASSWORD_CAPTCHA',
                        'template-id',
                    ),
                    ...captchaTime,
                },
                'account-bound': {
                    template: configure.env(
                        'USER_PHONE_QCLOOUD_ACCOUNTBOUND_CAPTCHA',
                        'template-id',
                    ),
                    ...captchaTime,
                },
            },
            email: {
                login: {
                    subject: '【用户登录】验证码',
                    template: configure.env('USER_EMAIL_SMTP_LOGIN_CAPTCHA', 'login'),
                    ...captchaTime,
                },
                register: {
                    subject: '【用户注册】验证码',
                    template: configure.env('USER_EMAIL_SMTP_REGISTER_CAPTCHA', 'register'),
                    ...captchaTime,
                },
                'retrieve-password': {
                    subject: '【找回密码】验证码',
                    template: configure.env(
                        'USER_EMAIL_SMTP_RETRIEVEPASSWORD_CAPTCHA',
                        'retrieve-password',
                    ),
                    ...captchaTime,
                },
                'reset-password': {
                    subject: '【重置密码】验证码',
                    template: configure.env(
                        'USER_EMAIL_SMTP_RESETPASSWORD_CAPTCHA',
                        'reset-password',
                    ),
                    ...captchaTime,
                },
                'account-bound': {
                    subject: '【绑定邮箱】验证码',
                    template: configure.env(
                        'USER_EMAIL_SMTP_ACCOUNTBOUND_CAPTCHA',
                        'account-bound',
                    ),
                    ...captchaTime,
                },
            },
        },
        relations: [],
    };
};
