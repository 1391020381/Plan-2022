import { ModuleMetadata, PipeTransform, Type } from '@nestjs/common';
import { IAuthGuard } from '@nestjs/passport';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { QueueOptions as BullMQOptions } from 'bullmq';
import dayjs from 'dayjs';
import Email from 'email-templates';
import { RedisOptions as IoRedisOptions } from 'ioredis';
import { Attachment } from 'nodemailer/lib/mailer';
import { Ora } from 'ora';

import { Configure } from './configure';

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
    /**
     * 配置类实例
     */
    configure: Configure;
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
     * 时区,默认Asia/Shanghai
     */
    timezone: string;
    /**
     * 语言,默认zh-cn
     */
    locale: string;
    /**
     * 是否为服务器运行状态(无法设置,通过指定SERVER环境变量使用,默认false)
     */
    server: boolean;

    /**
     * 控制台打印的url,默认自动生成
     */
    url?: string;

    /**
     * 由url+api前缀生成的基础api url
     */
    api?: string;
}

/**
 * 用于传入模块构建器和命令等的参数
 */
export type AppParams = {
    /**
     * 配置服务实例
     */
    configure: Configure;
    /**
     * 应用实例
     */
    app?: NestFastifyApplication;
};

/**
 * 创建应用的选项参数
 */
export interface CreateOptions {
    /**
     * 应用构建器
     */
    builder: AppBuilder;
    /**
     * 初始配置集
     */
    configs: Record<string, any>;
    /**
     * 全局配置
     */
    globals?: {
        /**
         * 全局管道,默认为AppPipe,设置为null则不添加
         * @param params
         */
        pipe?: (params: AppParams) => PipeTransform<any> | null;
        /**
         * 全局拦截器,默认为AppInterceptor,设置为null则不添加
         */
        interceptor?: Type<any> | null;
        /**
         * 全局过滤器,默认AppFilter,设置为null则不添加
         */
        filter?: Type<any> | null;
        /**
         * 全局守卫
         */
        guard?: Type<IAuthGuard>;
    };
    /**
     * 是否启用websockets服务
     */
    websockets?: boolean;
    /**
     * 配置服务的动态存储选项
     */
    configure?: ConfigStorageOption;
    /**
     * 模块列表
     * 一些核心模块,比如DatabaseModule,RestfulMuodle,CoreModule等无需在此处添加
     * 他们会根据配置自动添加
     */
    modules?: ModuleItem[];
    /**
     * 为启动模块添加一些自定义的ModuleMetaData数据
     * @param params
     */
    meta?: (params: AppParams) => ModuleMetadata;
}

/**
 * 模块类型
 */
export type ModuleItem = Type<any> | ModuleOption;

/**
 * 为模块加一些额外的参数,可以在构造时获取
 */
export type ModuleOption = { module: Type<any>; params?: Record<string, any> };

/**
 * 应用构建器
 */
export interface AppBuilder {
    (params: { configure: Configure; BootModule: Type<any> }): Promise<NestFastifyApplication>;
}

/**
 * 创建应用后返回的对象
 */
export interface CreatorData extends Required<AppParams> {
    modules: ModuleItem[];
}
/**
 * 应用创建函数
 */
export interface Creator {
    (): Promise<CreatorData>;
}

/**
 * 模块构建器参数选项
 */
export type ModuleBuilderMeta = ModuleMetadata & {
    global?: boolean;
};

/**
 * 模块构建器
 */
export type ModuleMetaRegister<P extends Record<string, any>> = (
    configure: Configure,
    params: P,
) => ModuleBuilderMeta | Promise<ModuleBuilderMeta>;
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

/** ****************************** 配置 ***************************** */

/**
 * 配置服务的yaml动态存储选项
 */
export interface ConfigStorageOption {
    /**
     * 是否开启动态存储
     */
    storage?: boolean;
    /**
     * yaml文件路径,默认为dist目录外的config.yaml
     */
    yamlPath?: string;
}

/**
 * 配置注册器函数
 */
export type ConfigureRegister<T extends Record<string, any>> = (
    configure: Configure,
) => T | Promise<T>;

/**
 * 配置构造器
 */
export interface ConfigureFactory<
    T extends Record<string, any>,
    C extends Record<string, any> = T,
> {
    /**
     * 配置注册器
     */
    register: ConfigureRegister<Partial<T>>;
    /**
     * 默认配置注册器
     */
    defaultRegister?: ConfigureRegister<T>;
    /**
     * 是否动态存储
     */
    storage?: boolean;
    /**
     * 回调函数
     * @param configure 配置类服务实例
     * @param value 配置注册器register执行后的返回值
     */
    hook?: (configure: Configure, value: T) => C | Promise<C>;
    /**
     * 深度合并时是否对数组采用追加模式,默认 false
     */
    append?: boolean;
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
