import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import { QueueOptions as BullMQOptions } from 'bullmq';
import dayjs from 'dayjs';
import Email from 'email-templates';
import { RedisOptions as IoRedisOptions } from 'ioredis';
import { Attachment } from 'nodemailer/lib/mailer';
import { Ora } from 'ora';

import { DbConfig } from '../database/types';

/** ****************************** 基础类型 **************************** */

/**
 * 基础类型接口
 */
export type BaseType = boolean | number | string | undefined | null;
/**
 * 环境变量类型转义函数接口
 */
export type ParseType<T extends BaseType = string> = (value: string) => T;
/**
 * 一个类的类型
 */
export type ClassType<T> = { new (...args: any[]): T };

/**
 * 类转义为普通对象后的类型
 */
export type ClassToPlain<T> = { [key in keyof T]: T[key] };

/**
 * 空对象
 */
export type RecordNever = Record<never, never>;
/**
 * 获取数组中元素的类型
 */
export type ArrayItem<A> = A extends readonly (infer T)[] ? T : never;

/**
 * 嵌套对象
 */
export type NestedRecord = Record<string, Record<string, any>>;

/**
 * 嵌套对象全部可选
 */
export type RePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] | undefined
        ? RePartial<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : RePartial<T[P]>
        : T[P];
};

/**
 * 嵌套对象全部必选
 */
export type ReRequired<T> = {
    [P in keyof T]-?: T[P] extends (infer U)[] | undefined
        ? ReRequired<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : ReRequired<T[P]>
        : T[P];
};

/** ****************************** 核心模块 **************************** */

/**
 * core模块参数选项
 */
export interface CoreOptions {
    database?: () => DbConfig;
    redis?: () => RedisConfig;
    queue?: (redis: RedisConfig) => QueueConfig;
    es?: () => ElasticsearchModuleOptions;
    sms?: () => SmsConfig;
    smtp?: () => SmtpConfig;
}

/** ****************************** 应用  ***************************** */

/**
 * 应用配置
 */
export interface AppConfig {
    /**
     * 主机地址,默认为127.0.0.1
     */
    host?: string;
    /**
     * 监听端口,默认3100
     */
    port?: number;
    /**
     * 是否开启https,默认false
     */
    https?: boolean;
    /**
     * 控制台打印的url,默认自动生成
     */
    url?: string;
    /**
     * 时区,默认Asia/Shanghai
     */
    timezone: string;
    /**
     * 语言,默认zh-cn
     */
    locale: string;
}

/** ****************************** Redis及队列 ***************************** */

/**
 * Redis配置,通过createConnectionOptions函数生成
 */
export type RedisConfig = RedisOption[];

/**
 * 自定义Redis配置
 */
export type RedisConfigOptions = IoRedisOptions | IoRedisOptions[];

/**
 * Redis连接配置项
 */
export type RedisOption = Omit<IoRedisOptions, 'name'> & { name: string };

/**
 * 队列配置,通过createQueueOptions函数生成
 */
export type QueueConfig = BullMQOptions | Array<{ name: string } & BullMQOptions>;

/**
 * 自定义队列配置
 */
export type QueueConfigOptions = QueueOption | Array<{ name: string } & QueueOption>;

/**
 * 队列项配置
 */
export type QueueOption = Omit<BullMQOptions, 'connection'> & { redis?: string };

/** ****************************** 时间  ***************************** */

/**
 * getTime函数获取时间的选项参数
 */
export interface TimeOptions {
    /**
     * 时间
     */
    date?: dayjs.ConfigType;
    /**
     * 输出格式
     */
    format?: dayjs.OptionType;
    /**
     * 语言
     */
    locale?: string;
    /**
     * 是否严格模式
     */
    strict?: boolean;
    /**
     * 时区
     */
    zonetime?: string;
}

/** ****************************** 发信服务  ***************************** */

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

/** ****************************** CLI及命令  ***************************** */

/**
 * 控制台错误函数panic的选项参数
 */
export interface PanicOption {
    /**
     * 报错消息
     */
    message: string;
    /**
     * ora对象
     */
    spinner?: Ora;
    /**
     * 抛出的异常信息
     */
    error?: any;
    /**
     * 是否退出进程
     */
    exit?: boolean;
}
