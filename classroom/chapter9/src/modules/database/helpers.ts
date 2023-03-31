import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { isNil } from 'lodash';

import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { ObjectLiteral, ObjectType, SelectQueryBuilder, DataSource, Repository } from 'typeorm';

import { database } from '@/config';
import { deepMerge, panic } from '@/modules/core/helpers';

import { createConnectionOptions } from '../core/helpers/options';
import { ClassType } from '../core/types';

import { ADDTIONAL_RELATIONS, CUSTOM_REPOSITORY_METADATA } from './constants';

import {
    DbConfig,
    DynamicRelation,
    DbConfigOptions,
    TypeormOption,
    IPaginateDto,
    OrderQueryType,
} from './types';

/** ****************************** 配置相关 **************************** */

/**
 * 创建数据库配置
 * @param options 自定义配置
 */
export const createDbOptions = (options: DbConfigOptions) => {
    const newOptions: DbConfigOptions = {
        common: deepMerge(
            {
                charset: 'utf8mb4',
                logging: ['error'],
            },
            options.common ?? {},
            'replace',
        ),
        connections: createConnectionOptions(options.connections ?? []),
    };
    newOptions.connections = newOptions.connections.map((connection) => {
        const entities = connection.entities ?? [];
        const newOption = { ...connection, entities };
        return deepMerge(
            newOptions.common,
            { ...newOption, autoLoadEntities: true } as any,
            'replace',
        );
    });
    return newOptions as DbConfig;
};

/**
 * 根据数据配置名称获取一个数据库连接配置
 * @param cname 默认为default
 */
export function getDbConfig(cname = 'default') {
    const { connections = [] }: DbConfig = database();
    const dbConfig = connections.find(({ name }) => name === cname);
    if (isNil(dbConfig)) panic(`Database connection named ${cname} not exists!`);
    return dbConfig as TypeormOption;
}

/** ****************************** 类注册及读取 **************************** */

/**
 * 在模块上注册entity
 * @param entities entity类列表
 * @param dataSource 数据连接名称,默认为default
 */
export const addEntities = (entities: EntityClassOrSchema[] = [], dataSource = 'default') => {
    /**
     * 为有动态关联的entity添加动态关联
     */
    const es = entities.map((e) => {
        const relationsRegister = Reflect.getMetadata(ADDTIONAL_RELATIONS, e);
        if ('prototype' in e && relationsRegister && typeof relationsRegister === 'function') {
            const relations: DynamicRelation[] = relationsRegister();
            relations.forEach(({ column, relation, others }) => {
                const cProperty = Object.getOwnPropertyDescriptor(e.prototype, column);
                if (!cProperty) {
                    Object.defineProperty(e.prototype, column, {
                        writable: true,
                    });
                    relation(e.prototype, column);
                    if (!isNil(others)) {
                        for (const other of others) {
                            other(e.prototype, column);
                        }
                    }
                }
            });
        }
        return e;
    });
    return TypeOrmModule.forFeature(es, dataSource);
};

/**
 * 获取自定义Repository的实例
 * @param dataSource 数据连接池
 * @param Repo repository类
 */
export const getCustomRepository = <T extends Repository<E>, E extends ObjectLiteral>(
    dataSource: DataSource,
    Repo: ClassType<T>,
): T => {
    if (isNil(Repo)) return null;
    const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);
    if (!entity) return null;
    const base = dataSource.getRepository<ObjectType<any>>(entity);
    return new Repo(base.target, base.manager, base.queryRunner) as T;
};

/** ****************************** 数据查询及操作 **************************** */

/**
 * 手动分页函数
 * @param param0 分页选项
 * @param data 数据列表
 */
export function manualPaginate<T extends ObjectLiteral>(
    { page, limit }: IPaginateDto,
    data: T[],
): Pagination<T> {
    let items: T[] = [];
    const totalItems = data.length;
    const totalRst = totalItems / limit;
    const totalPages =
        totalRst > Math.floor(totalRst) ? Math.floor(totalRst) + 1 : Math.floor(totalRst);
    let itemCount = 0;
    if (page <= totalPages) {
        itemCount = page === totalPages ? totalItems - (totalPages - 1) * limit : limit;
        const start = (page - 1) * limit;
        items = data.slice(start, start + itemCount);
    }
    const meta: IPaginationMeta = {
        itemCount,
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
    };
    return {
        meta,
        items,
    };
}

/**
 * 为查询添加排序,默认排序规则为DESC
 * @param qb 原查询
 * @param alias 别名
 * @param orderBy 查询排序
 */
export const getOrderByQuery = <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    alias: string,
    orderBy?: OrderQueryType,
) => {
    if (isNil(orderBy)) return qb;
    if (typeof orderBy === 'string') return qb.orderBy(`${alias}.${orderBy}`, 'DESC');
    if (Array.isArray(orderBy)) {
        let q = qb;
        const i = 0;
        for (const item of orderBy) {
            if (i === 0) {
                q =
                    typeof item === 'string'
                        ? q.orderBy(`${alias}.${item}`, 'DESC')
                        : q.orderBy(`${alias}.${item}`, item.order);
            } else {
                q =
                    typeof item === 'string'
                        ? q.addOrderBy(`${alias}.${item}`, 'DESC')
                        : q.addOrderBy(`${alias}.${item}`, item.order);
            }
        }
        return q;
    }
    return qb.orderBy(`${alias}.${(orderBy as any).name}`, (orderBy as any).order);
};
