import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { IPaginationMeta, IPaginationOptions } from 'nestjs-typeorm-paginate';

import {
    FindTreeOptions,
    ManyToMany,
    ManyToOne,
    ObjectLiteral,
    OneToMany,
    OneToOne,
    Repository,
    SelectQueryBuilder,
    TreeRepository,
} from 'typeorm';

import { BaseRepository } from './base/repository';
import { BaseTreeRepository } from './base/tree.repository';

import { QueryTrashMode, OrderType } from './constants';

/** ****************************** 数据库配置 **************************** */

/**
 * 自定义数据库配置
 */
export type DbConfigOptions = {
    common: Record<string, any>;
    connections: Array<TypeOrmModuleOptions>;
};

/**
 * 最终数据库配置
 */
export type DbConfig = Record<string, any> & {
    common: Record<string, any>;
    connections: TypeormOption[];
};

/**
 * Typeorm连接配置
 */
export type TypeormOption = Omit<TypeOrmModuleOptions, 'name' | 'migrations'> & {
    name: string;
};

/** ****************************** 数据查询及操作 **************************** */

/**
 * 动态关联接口
 */
export interface DynamicRelation {
    relation:
        | ReturnType<typeof OneToOne>
        | ReturnType<typeof OneToMany>
        | ReturnType<typeof ManyToOne>
        | ReturnType<typeof ManyToMany>;
    others?: Array<(...args: any) => any>;
    column: string;
}

/**
 * Repository类型
 */
export type RepositoryType<E extends ObjectLiteral> =
    | Repository<E>
    | TreeRepository<E>
    | BaseRepository<E>
    | BaseTreeRepository<E>;

/**
 * subscriber设置属性
 */
export type SubcriberSetting = {
    // 监听的模型是否为树模型
    tree?: boolean;
    // 是否支持软删除
    trash?: boolean;
};

/**
 * 排序类型,{字段名称: 排序方法}
 * 如果多个值则传入数组即可
 * 排序方法不设置,默认DESC
 */
export type OrderQueryType =
    | string
    | { name: string; order: `${OrderType}` }
    | Array<{ name: string; order: `${OrderType}` } | string>;

/**
 * 为query添加查询的回调函数接口
 */
export type QueryHook<Entity> = (
    hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

/**
 * 数据列表查询类型
 */
export interface QueryParams<E extends ObjectLiteral> {
    addQuery?: (query: SelectQueryBuilder<E>) => SelectQueryBuilder<E>;
    orderBy?: OrderQueryType;
    withTrashed?: boolean;
}

/**
 * 树形数据表查询参数
 */
export type TreeQueryParams<E extends ObjectLiteral> = FindTreeOptions & QueryParams<E>;

/**
 * 分页验证DTO接口
 */
export interface IPaginateDto<C extends IPaginationMeta = IPaginationMeta>
    extends Omit<IPaginationOptions<C>, 'page' | 'limit'> {
    page: number;
    limit: number;
}

/**
 * 服务类数据列表查询类型
 */
export type ServiceListQueryParams<E extends ObjectLiteral> =
    | ServiceListQueryParamsWithTrashed<E>
    | ServiceListQueryParamsNotWithTrashed<E>;

/**
 * 带有软删除的服务类数据列表查询类型
 */
type ServiceListQueryParamsWithTrashed<E extends ObjectLiteral> = Omit<
    TreeQueryParams<E>,
    'withTrashed'
> & {
    trashed?: `${QueryTrashMode}`;
} & Record<string, any>;

/**
 * 不带软删除的服务类数据列表查询类型
 */
type ServiceListQueryParamsNotWithTrashed<E extends ObjectLiteral> = Omit<
    ServiceListQueryParamsWithTrashed<E>,
    'trashed'
>;

/**
 * 软删除DTO接口
 */
export interface TrashedDto {
    trashed?: QueryTrashMode;
}
