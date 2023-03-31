import { Faker } from '@faker-js/faker';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { IPaginationMeta, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { Ora } from 'ora';
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
    EntityTarget,
    DataSource,
    ObjectType,
    EntityManager,
} from 'typeorm';

import yargs from 'yargs';

import { ReRequired } from '@/modules/core/types';

import { Configure } from '../core/configure';

import { BaseRepository } from './base/repository';
import { BaseTreeRepository } from './base/tree.repository';

import { QueryTrashMode, OrderType } from './constants';
import { FactoryService } from './services';

/** ****************************** 数据库配置 **************************** */

/**
 * 自定义数据库配置
 */
export type DbConfigOptions = {
    common: Record<string, any> & DbAdditionalOption;
    connections: Array<TypeOrmModuleOptions & DbAdditionalOption>;
};

/**
 * 最终数据库配置
 */
export type DbConfig = Record<string, any> & {
    common: Record<string, any> & ReRequired<DbAdditionalOption>;
    connections: TypeormOption[];
};

/**
 * Typeorm连接配置
 */
export type TypeormOption = Omit<TypeOrmModuleOptions, 'name' | 'migrations'> & {
    name: string;
} & Required<DbAdditionalOption>;

/**
 * 额外数据库选项,用于CLI工具
 */
type DbAdditionalOption = {
    // migrations?: Array<Type<any>>;
    /**
     * 填充类
     */
    seedRunner?: SeederConstructor;
    /**
     * 填充类列表
     */
    seeders?: SeederConstructor[];
    /**
     * 数据构建函数列表
     */
    factories?: (() => DbFactoryOption<any, any>)[];
    paths?: {
        /**
         * 迁移文件路径
         */
        migration?: string;
    };
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

/** ****************************** 数据结构迁移 **************************** */

/**
 * 基础数据库命令参数类型
 */
export type TypeOrmArguments = yargs.Arguments<{
    connection?: string;
}>;

/**
 * 创建迁移命令参数
 */
export type MigrationCreateArguments = TypeOrmArguments & MigrationCreateOptions;

/**
 * 生成迁移命令参数
 */
export type MigrationGenerateArguments = TypeOrmArguments & MigrationGenerateOptions;

/**
 * 运行迁移的命令参数
 */
export type MigrationRunArguments = TypeOrmArguments & MigrationRunOptions;

/**
 * 恢复迁移的命令参数
 */
export type MigrationRevertArguments = TypeOrmArguments & MigrationRevertOptions;

/**
 *  刷新迁移的命令参数
 */
// export type MigrationRefreshArguments = TypeOrmArguments & MigrationRefreshOptions;

/**
 * 创建迁移处理器选项
 */
export interface MigrationCreateOptions {
    name: string;
    outputJs?: boolean;
}

/**
 * 生成迁移处理器选项
 */
export interface MigrationGenerateOptions {
    name: string;
    run?: boolean;
    pretty?: boolean;
    outputJs?: boolean;
    dryrun?: boolean;
    check?: boolean;
}

/**
 * 恢复迁移处理器选项
 */
export interface MigrationRunOptions extends MigrationRevertOptions {
    refresh?: boolean;
    onlydrop?: boolean;
    seed?: boolean;
    clear?: boolean;
}

/**
 * 恢复迁移处理器选项
 */
export interface MigrationRevertOptions {
    transaction?: string;
    fake?: boolean;
}

/**
 * 刷新迁移处理器选项
 */
// export interface MigrationRefreshOptions extends MigrationRunRevertOptions {
//     seed?: boolean;
//     onlydrop?: boolean;
// }

/** ****************************** 数据填充Seeder **************************** */
/**
 * 数据填充命令参数
 */
export type SeederArguments = TypeOrmArguments & SeederOptions;

/**
 * 数据填充处理器选项
 */
export interface SeederOptions {
    connection?: string;
    transaction?: boolean;
}

/**
 * 数据填充类接口
 */
export interface SeederConstructor {
    new (spinner: Ora, args: SeederOptions): Seeder;
}

/**
 * 数据填充类方法对象
 */
export interface Seeder {
    load: (params: SeederLoadParams) => Promise<void>;
}

/**
 * 数据填充类的load函数参数
 */
export interface SeederLoadParams {
    /**
     * 数据库连接名称
     */
    connection: string;
    /**
     * 数据库连接池
     */
    dataSource: DataSource;

    /**
     * EntityManager实例
     */
    em: EntityManager;

    /**
     * Factory解析器
     */
    factorier?: DbFactory;
    /**
     * Factory函数列表
     */
    factories: FactoryOptions;

    /**
     * 项目配置类
     */
    configure: Configure;
}

/** ****************************** 数据填充Factory **************************** */

/**
 * Factory解析器
 */
export interface DbFactory {
    <Entity>(entity: EntityTarget<Entity>): <Options>(
        options?: Options,
    ) => FactoryService<Entity, Options>;
}

/**
 * Factory处理器
 */
export type DbFactoryHandler<E, O> = (faker: Faker, options: O) => Promise<E>;

/**
 * Factory解析后的元数据
 */
export type DbFactoryOption<E, O> = {
    entity: ObjectType<E>;
    handler: DbFactoryHandler<E, O>;
};

/**
 * 数据填充函数映射对象
 */
export type FactoryOptions = {
    [entityName: string]: DbFactoryOption<any, any>;
};

/**
 * Factory自定义参数覆盖
 */
export type FactoryOverride<Entity> = {
    [Property in keyof Entity]?: Entity[Property];
};

/**
 * Factory构造器
 */
export type DbFactoryBuilder = (
    dataSource: DataSource,
    factories: {
        [entityName: string]: DbFactoryOption<any, any>;
    },
) => DbFactory;

/**
 * Factory定义器
 */
export type DefineFactory = <E, O>(
    entity: ObjectType<E>,
    handler: DbFactoryHandler<E, O>,
) => () => DbFactoryOption<E, O>;
