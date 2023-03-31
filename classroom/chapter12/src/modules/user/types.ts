import { ClassToPlain, RecordNever } from '@/modules/core/types';

import { DynamicRelation } from '../database/types';

import { CaptchaActionType, CaptchaDtoGroups, CaptchaType } from './constants';
import { MessageEntity, CaptchaEntity } from './entities';

export type UserEnabled = `${CaptchaDtoGroups}` | 'message';
/**
 * 用户模块配置
 */
export interface UserConfig {
    enables: UserEnabled[];
    super: {
        username: string;
        password: string;
    };
    /**
     * 默认用户头像
     */
    avatar: string;
    hash: number;
    jwt: JwtConfig;
    captcha: CaptchaConfig;
    relations: DynamicRelation[];
}

/**
 * 自定义验证码配置
 */
// export interface CustomCaptchaConfig {
//     [CaptchaType.PHONE]?: {
//         [key in CaptchaActionType]?: Partial<PhoneCaptchaOption>;
//     };
//     [CaptchaType.EMAIL]?: {
//         [key in CaptchaActionType]?: Partial<EmailCaptchaOption>;
//     };
// }

/**
 * 默认验证码配置
 */
export interface CaptchaConfig {
    [CaptchaType.PHONE]: {
        [key in CaptchaActionType]: PhoneCaptchaOption;
    };
    [CaptchaType.EMAIL]: {
        [key in CaptchaActionType]: EmailCaptchaOption;
    };
}

/**
 * JWT配置
 */
export interface JwtConfig {
    secret: string;
    token_expired: number;
    refresh_secret: string;
    refresh_token_expired: number;
}

/**
 * JWT荷载
 *
 * @export
 * @interface JwtPayload
 */
export interface JwtPayload {
    sub: string;
    iat: number;
}
/**
 * 通用验证码选项
 */
export interface CaptchaTimeOption {
    limit: number; // 验证码发送间隔时间
    expired: number; // 验证码有效时间
}

/**
 * 手机验证码选项
 */
export interface PhoneCaptchaOption extends CaptchaTimeOption {
    template: string; // 云厂商短信推送模板ID
}

/**
 * 邮件验证码选项
 */
export interface EmailCaptchaOption extends CaptchaTimeOption {
    subject: string; // 邮件主题
    template?: string; // 模板路径
}

/**
 * 任务传给消费者的数据类型
 */
export interface SendCaptchaQueueJob {
    captcha: { [key in keyof CaptchaEntity]: CaptchaEntity[key] };
    option: PhoneCaptchaOption | EmailCaptchaOption;
    otherVars?: Record<string, any>;
}

/**
 * 验证码正确性验证
 */
export type CaptchaValidate<T extends Record<string, any> = RecordNever> = T & {
    value: string;
    code: string;
};

/**
 * 异步存储消息的数据类型
 */
export type SaveMessageQueueJob = Pick<ClassToPlain<MessageEntity>, 'title' | 'body' | 'type'> & {
    receviers: string[];
    sender: string;
};
