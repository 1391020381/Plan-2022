import bcrypt from 'bcrypt';
import { get } from 'lodash';

import { userConfig } from '@/config';

import { deepMerge } from '@/helpers';

import { CaptchaActionType, CaptchaType } from './constants';
import { DefaultUserConfig } from './types';

const defaultCaptchaTime = { limit: 60, expired: 60 * 30 };
/**
 * 获取默认的验证码配置
 * @param type
 */
const getDefaultCaptcha = (type: CaptchaType) => {
    const subjects: { [key in CaptchaActionType]: string } = {
        register: '【用户注册】验证码',
        login: '【用户登录】验证码',
        'retrieve-password': '【找回密码】验证码',
        'reset-password': '【重置密码】验证码',
        'account-bound': '【绑定邮箱】验证码',
    };
    return Object.fromEntries(
        Object.values(CaptchaActionType).map((t) => [
            t,
            type === CaptchaType.SMS ? {} : { subject: subjects[t] },
        ]),
    );
};
/**
 * 默认用户配置
 */
const defaultConfig: DefaultUserConfig = {
    super: {
        username: 'admin',
        password: 'password',
    },
    hash: 10,
    jwt: {
        token_expired: 3600,
        refresh_token_expired: 3600 * 30,
    },
    captcha: {
        time: {
            register: defaultCaptchaTime,
            login: defaultCaptchaTime,
            'retrieve-password': defaultCaptchaTime,
            'reset-password': defaultCaptchaTime,
            'account-bound': defaultCaptchaTime,
        },
        sms: getDefaultCaptcha(CaptchaType.SMS) as any,
        email: getDefaultCaptcha(CaptchaType.EMAIL) as any,
    },
};

/**
 * 获取user模块配置的值
 * @param key
 */
export function getUserConfig<T>(key?: string): T {
    const config = deepMerge(defaultConfig, userConfig(), 'merge');
    return key ? get(config, key) : config;
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
export const encrypt = (password: string) => {
    return bcrypt.hashSync(password, userConfig().hash);
};

/**
 * 验证密码
 * @param password
 * @param hashed
 */
export const decrypt = (password: string, hashed: string) => {
    return bcrypt.compareSync(password, hashed);
};
