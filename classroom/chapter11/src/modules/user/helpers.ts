import { resolve } from 'path';

import bcrypt from 'bcrypt';
import { isNil } from 'lodash';

import { App } from '../core/app';

import { Configure } from '../core/configure';

import { EnvironmentType } from '../core/constants';

import { CaptchaActionType, CaptchaType } from './constants';
import { DefaultUserConfig } from './types';

const defaultCaptchaTime = { limit: 60, expired: 60 * 30 };

/**
 * 默认用户配置
 */
export const defaultUserConfig = (configure: Configure): DefaultUserConfig => {
    const jwtExpiredTime =
        configure.getRunEnv() === EnvironmentType.PRODUCTION ? 3600 : 3600 * 10000;
    return {
        super: {
            username: configure.env('SUPER_ADMIN_USERNAME', 'admin'),
            password: configure.env('SUPER_ADMIN_PASSWORD', '123456aA$'),
        },
        hash: 10,
        avatar: resolve(__dirname, '../../assets/media', 'avatar.png'),
        jwt: {
            secret: 'my-secret',
            token_expired: jwtExpiredTime,
            refresh_secret: 'my-refresh-secret',
            refresh_token_expired: jwtExpiredTime * 30,
        },
        captcha: {
            time: getDefaultCaptcha(configure, 'time') as any,
            sms: getDefaultCaptcha(configure, CaptchaType.SMS) as any,
            email: getDefaultCaptcha(configure, CaptchaType.EMAIL) as any,
        },
        relations: [],
    };
};

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
 * 获取默认的验证码配置
 * @param type
 */
const getDefaultCaptcha = (configure: Configure, type: CaptchaType | 'time') => {
    const subjects: { [key in CaptchaActionType]: string } = {
        register: '【用户注册】验证码',
        login: '【用户登录】验证码',
        'retrieve-password': '【找回密码】验证码',
        'reset-password': '【重置密码】验证码',
        'account-bound': '【绑定邮箱】验证码',
    };
    const smsTemplates: { [key in CaptchaActionType]: string } = {
        login: configure.env('SMS_LOGIN_CAPTCHA', 'template-id'),
        register: configure.env('SMS_REGISTER_CAPTCHA', 'template-id'),
        'retrieve-password': configure.env('SMS_RETRIEVEPASSWORD_CAPTCHA', 'template-id'),
        'reset-password': configure.env('SMS_RESETPASSWORD_CAPTCHA', 'template-id'),
        'account-bound': configure.env('SMS_ACCOUNTBOUND_CAPTCHA', 'template-id'),
    };
    return Object.fromEntries(
        Object.values(CaptchaActionType).map((t) => {
            if (type === 'time') return [t, defaultCaptchaTime];
            return [
                t,
                type === CaptchaType.SMS
                    ? { template: smsTemplates[t] }
                    : { subject: subjects[t], template: t },
            ];
        }),
    );
};
