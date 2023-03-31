import Email from 'email-templates';
import { Attachment } from 'nodemailer/lib/mailer';

import { NestedRecord, RecordNever } from '../core/types';

/**
 * 腾讯云短信驱动配置
 */
export type SmsConfig<T extends NestedRecord = RecordNever> = {
    secretId: string;
    secretKey: string;
    sign: string;
    appid: string;
    region: string;
    endpoint?: string;
} & T;

/**
 * 发送接口参数
 */
export interface SmsSendParams {
    appid?: string;
    numbers: string[];
    template: string;
    sign?: string;
    endpoint?: string;
    vars?: Record<string, any>;
    ExtendCode?: string;
    SessionContext?: string;
    SenderId?: string;
}

/**
 * SMTP邮件发送配置
 */
export type SmtpConfig<T extends NestedRecord = RecordNever> = {
    host: string;
    user: string;
    password: string;
    /**
     * Email模板总路径
     */
    resource: string;
    from?: string;
    /**
     * smtp端口,默认25(开启后为443)
     */
    port?: number;
    /**
     * 是否开启ssl
     */
    secure?: boolean;
} & T;

/**
 * Smtp发送接口配置
 */
export interface SmtpSendParams {
    // 模板名称
    name?: string;
    // 发信地址
    from?: string;
    // 主题
    subject?: string;
    // 目标地址
    to: string | string[];
    // 回信地址
    reply?: string;
    // 是否加载html模板
    html?: boolean;
    // 是否加载text模板
    text?: boolean;
    // 模板变量
    vars?: Record<string, any>;
    // 是否预览
    preview?: boolean | Email.PreviewEmailOpts;
    // 主题前缀
    subjectPrefix?: string;
    // 附件
    attachments?: Attachment[];
}
