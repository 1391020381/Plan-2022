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
 * API配置
 */
export interface ApiConfig extends ApiDocSource {
    prefix?: {
        route?: string;
        doc?: string;
    };
    default: string;
    enabled: string[];
    versions: Record<string, VersionOption>;
}

/**
 * 版本配置
 */
export interface VersionOption extends ApiDocSource {
    routes?: RouteOption[];
}

/**
 * 路由配置
 */
export interface RouteOption {
    name: string;
    path: string;
    controllers: Type<any>[];
    children?: RouteOption[];
    doc?: ApiDocSource;
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
    routes?: { [key: string]: SwaggerOption };
}

/**
 * 总配置,版本,路由中用于swagger的选项
 */
export interface ApiDocSource {
    title?: string;
    description?: string;
    auth?: boolean;
    tags?: (string | TagOption)[];
}

interface TagOption {
    name: string;
    description?: string;
    externalDocs?: ExternalDocumentationObject;
}
