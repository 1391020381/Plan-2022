import { Type } from '@nestjs/common';
import { ExternalDocumentationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ClassTransformOptions } from 'class-transformer';

/**
 * CURD控制器方法列表
 */
export type CurdMethod = 'detail' | 'delete' | 'restore' | 'list' | 'store' | 'update';

/**
 * CRUD装饰器的方法选项
 */
export interface CrudMethodOption {
    /**
     * 该方法是否允许匿名访问
     */
    allowGuest?: boolean;
    /**
     * 序列化选项,如果为`noGroup`则不传参数，否则根据`id`+方法匹配来传参
     */
    serialize?: ClassTransformOptions | 'noGroup';
    hook?: (target: Type<any>, method: string) => void;
}
/**
 * 每个启用方法的配置
 */
export interface CurdItem {
    name: CurdMethod;
    option?: CrudMethodOption;
}

/**
 * CRUD装饰器选项
 */
export interface CurdOptions {
    id: string;
    // 需要启用的方法
    enabled: Array<CurdMethod | CurdItem>;
    // 一些方法要使用到的自定义DTO
    dtos: {
        [key in 'list' | 'store' | 'update']?: Type<any>;
    };
}

/**
 * Restful模块配置
 */
export interface ApiConfig extends ApiDocSource {
    /**
     * 分别指定应用和Open API的总前缀
     */
    prefix?: {
        route?: string;
        doc?: string;
    };
    /**
     * 默认版本
     */
    default: string;
    /**
     * 启用的版本
     * 默认版本不需要添加,如果是空数组则只启用默认版本
     */
    enabled: string[];
    /**
     * 所有版本的配置
     */
    versions: Record<string, VersionOption>;
}

/**
 * 版本配置
 */
export interface VersionOption extends ApiDocSource {
    /**
     * 应用配置
     */
    apps?: AppOption[];
}

/**
 * 应用API配置
 */
export interface AppOption extends RouteOption {
    /**
     * Open API配置,用于覆盖总配置
     */
    doc?: ApiDocSource;
}

/**
 * 路由项目配置
 */
export interface RouteOption {
    /**
     * 生成的路由模块名称前缀,用于追踪路由模块
     */
    name: string;
    /**
     * 路由前缀
     */
    path: string;
    /**
     * 加载的控制器
     */
    controllers: Type<any>[];
    /**
     * 路由表
     */
    children?: RouteOption[];
}

/**
 * 总配置,版本,路由中用于swagger的选项
 */
export interface ApiDocSource {
    /**
     * API文档标题
     */
    title?: string;
    /**
     * API文档描述
     */
    description?: string;
    /**
     * 是否启用JWT登录验证
     */
    auth?: boolean;
    /**
     * API文档标签
     */
    tags?: (string | TagOption)[];
}

/**
 * API文档标签选项
 */
interface TagOption {
    /**
     * 标签名称
     */
    name: string;
    /**
     * 标签描述
     */
    description?: string;
    /**
     * 额外的配置
     */
    externalDocs?: ExternalDocumentationObject;
}

/**
 * swagger选项
 */
export interface SwaggerOption extends ApiDocSource {
    version: string;
    path: string;
    include: Type<any>[];
}

/**
 * API与swagger整合的选项
 */
export interface APIDocOption {
    default?: SwaggerOption;
    apps?: { [key: string]: SwaggerOption };
}
