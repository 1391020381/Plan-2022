import { ModuleMetadata, PipeTransform, Type } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { Configure } from './configure';

/** ******************** 应用创建  ********************* */
/**
 * 应用创建函数
 */
export interface Creator {
    (): Promise<CreatorData>;
}

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
    };

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
 * 创建应用后返回的对象
 */
export interface CreatorData extends Required<AppParams> {
    modules: ModuleBuildMap;
}

/**
 * 应用构建器
 */
export interface AppBuilder {
    (params: { configure: Configure; BootModule: Type<any> }): Promise<NestFastifyApplication>;
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

/** ******************** 模块构造  ********************* */

/**
 * 模块类型
 */
export type ModuleItem = Type<any> | ModuleOption;

/**
 * 为模块加一些额外的参数,可以在构造时获取
 */
export type ModuleOption = { module: Type<any>; params?: Record<string, any> };

export type ModuleBuildMap = Record<string, { meta: ModuleBuilderMeta; module: Type<any> }>;

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

/** ******************** 配置系统  ********************* */

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
    register: ConfigureRegister<RePartial<T>>;
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

export type ConnectionOption<T extends Record<string, any>> = { name?: string } & T;
export type ConnectionRst<T extends Record<string, any>> = Array<{ name: string } & T>;