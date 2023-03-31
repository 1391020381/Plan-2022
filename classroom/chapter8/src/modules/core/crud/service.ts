import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { isNil } from 'lodash';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { manualPaginate } from '@/helpers';
import { PaginateDto } from '@/helpers/types';

import { QueryTrashMode } from '../constants';
import { QueryHook, QueryListParams, QueryParams } from '../types';

import { BaseRepository } from './repository';
import { BaseTreeRepository } from './tree.repository';

/**
 * @description CURD操作服务
 * @export
 * @abstract
 * @class BaseService
 * @template E 主模型
 * @template P 查询参数类型
 * @template M 分页查询返回的元数据类型
 */
export abstract class BaseService<
    E extends ObjectLiteral,
    R extends BaseRepository<E> | BaseTreeRepository<E>,
    P extends QueryListParams<E> = QueryListParams<E>,
    M extends IPaginationMeta = IPaginationMeta,
> {
    /**
     * @description 服务默认存储类
     * @protected
     * @type {DataServiceRepo<E>}
     */
    protected repository: R;

    /**
     * @description 是否开启软删除功能
     * @protected
     */
    protected enable_trash = false;

    constructor(repository: R) {
        this.repository = repository;
        if (
            !(
                this.repository instanceof BaseRepository ||
                this.repository instanceof BaseTreeRepository
            )
        ) {
            throw new Error(
                'Repository must instance of BaseRepository or BaseTreeRepository in DataService!',
            );
        }
    }

    /**
     * @description 获取数据列表
     * @param {P} [params]
     * @param {QueryHook<E>} [callback]
     */
    async list(params?: P, callback?: QueryHook<E>): Promise<E[]> {
        const options = params ?? ({} as P);
        // @ts-ignore
        const queryName = this.repository.getQBName();
        const trashed = options.trashed ?? QueryTrashMode.NONE;
        if (this.repository instanceof BaseTreeRepository) {
            let addQuery: QueryParams<E>['addQuery'];
            if (trashed === QueryTrashMode.ONLY) {
                addQuery = (qb) => qb.where(`${queryName}.deletedAt IS NOT NULL`);
            }
            const tree = await this.repository.findTrees({
                ...options,
                addQuery,
                withTrashed: trashed === QueryTrashMode.ALL || trashed === QueryTrashMode.ONLY,
            });
            return this.repository.toFlatTrees(tree);
        }
        const qb = await this.buildListQuery(this.repository.buildBaseQuery(), options, callback);
        return qb.getMany();
    }

    /**
     * @description 获取分页数据
     * @param {PaginateDto<M>} options
     * @param {P} [params]
     * @param {QueryHook<E>} [callback]
     */
    async paginate(
        options: PaginateDto<M> & P,
        callback?: QueryHook<E>,
    ): Promise<Pagination<E, M>> {
        const queryOptions = options ?? ({} as P);
        if (this.repository instanceof BaseTreeRepository) {
            const data = await this.list(queryOptions, callback);
            return manualPaginate(options, data) as Pagination<E, M>;
        }
        const qb = await this.buildListQuery(
            this.repository.buildBaseQuery(),
            queryOptions,
            callback,
        );
        return paginate(qb, options);
    }

    /**
     * @description 获取数据详情
     * @param {string} id
     * @param {QueryHook<E>} [callback]
     * @returns {*}  {Promise<E>}
     */
    async detail(id: string, trashed?: boolean, callback?: QueryHook<E>): Promise<E> {
        let qb = this.repository.buildBaseQuery();
        qb.where(`${this.repository.getQBName()}.id = :id`, { id });
        if (callback) qb = await callback(qb);
        if (trashed) qb.withDeleted();
        const item = await qb.getOne();
        if (!item) throw new NotFoundException(`${this.repository.getQBName()} ${id} not exists!`);
        return item;
    }

    /**
     * @description 创建数据,如果子类没有实现则抛出404
     * @param {*} data
     * @returns {*}  {Promise<E>}
     */
    create(data: any): Promise<E> {
        throw new ForbiddenException(`Can not to create ${this.repository.getQBName()}!`);
    }

    /**
     * @description 更新数据,如果子类没有实现则抛出404
     * @param {*} data
     * @returns {*}  {Promise<E>}
     */
    update(data: any): Promise<E> {
        throw new ForbiddenException(`Can not to update ${this.repository.getQBName()}!`);
    }

    /**
     *  删除数据
     * @param id
     * @param trash
     */
    async delete(id: string, trash = true) {
        const item = await this.repository.findOneOrFail({
            where: { id } as any,
            withDeleted: this.enable_trash ? true : undefined,
        });
        if (this.enable_trash && trash && isNil(item.deletedAt)) {
            // await this.repository.softRemove(item);
            (item as any).deletedAt = new Date();
            if (this.repository instanceof BaseTreeRepository<E>) {
                const dt = await this.repository.findDescendantsTree(item);
                (item as any).parent = null;
                for (const child of dt.children) {
                    child.parent = null;
                    await this.repository.save(child);
                }
            }
            await (this.repository as any).save(item);
            return this.detail(id, true);
        }
        return this.repository.remove(item);
    }

    /**
     * @description 批量删除数据
     * @param {string[]} data
     * @param {P} [params]
     * @param {boolean} [trash] 是否只扔到回收站,如果为true则软删除
     * @param {QueryHook<E>} [callback]
     * @returns 返回删除后的数据列表
     */
    async deleteList(data: string[], params?: P, trash?: boolean, callback?: QueryHook<E>) {
        const isTrash = trash === undefined ? true : trash;
        for (const id of data) {
            await this.delete(id, isTrash);
        }
        return this.list(params, callback);
    }

    /**
     * @description 批量删除数据(分页)
     * @param {string[]} data
     * @param {PaginateDto<M>} pageOptions
     * @param {P} [params]
     * @param {boolean} [trash]
     * @param {QueryHook<E>} [callback] 是否只扔到回收站,如果为true则软删除
     * @returns  返回删除后的分页数据
     */
    async deletePaginate(
        data: string[],
        options: PaginateDto<M> & P,
        trash?: boolean,
        callback?: QueryHook<E>,
    ) {
        const isTrash = trash === undefined ? true : trash;
        for (const id of data) {
            await this.delete(id, isTrash);
        }
        return this.paginate(options, callback);
    }

    /**
     * 恢复回收站中的数据
     * @param id
     * @param callback
     */
    async restore(id: string, callback?: QueryHook<E>) {
        if (!this.enable_trash) {
            throw new ForbiddenException(
                `Can not to retore ${this.repository.getQBName()},because trash not enabled!`,
            );
        }
        const item = await this.repository.findOneOrFail({
            where: { id } as any,
            withDeleted: true,
        });
        if ((item as any).deletedAt) {
            await this.repository.restore(item.id);
        }
        return this.detail(item.id, false, callback);
    }

    /**
     * @description 批量恢复回收站中的数据
     * @param {string[]} data
     * @param {P} [params]
     * @param {QueryHook<E>} [callback]
     * @returns 返回数据列表
     */
    async restoreList(data: string[], params?: P, callback?: QueryHook<E>) {
        for (const id of data) {
            await this.restore(id);
        }
        return this.list(params, callback);
    }

    /**
     * @description 批量恢复回收站中的数据(分页)
     * @param {string[]} data
     * @param {PaginateDto<M>} pageOptions
     * @param {*} [params]
     * @param {QueryHook<E>} [callback]
     * @returns 返回分页数据
     */
    async restorePaginate(data: string[], options: PaginateDto<M> & P, callback?: QueryHook<E>) {
        for (const id of data) {
            await this.restore(id);
        }
        return this.paginate(options, callback);
    }

    /**
     * @description 获取查询单个项目的QueryBuilder
     * @protected
     * @param {SelectQueryBuilder<E>} query
     * @param {QueryHook<E>} [callback]
     */
    protected async buildItemQuery(query: SelectQueryBuilder<E>, callback?: QueryHook<E>) {
        if (callback) {
            return callback(query);
        }
        return query;
    }

    /**
     * 获取查询数据列表的 QueryBuilder
     * @param qb
     * @param options
     * @param callback
     */
    protected async buildListQuery(qb: SelectQueryBuilder<E>, options: P, callback?: QueryHook<E>) {
        const queryName = this.repository.getQBName();
        const { trashed } = options;
        // 是否查询回收站
        if (trashed === QueryTrashMode.ALL || trashed === QueryTrashMode.ONLY) {
            qb.withDeleted();
            if (trashed === QueryTrashMode.ONLY) {
                qb.where(`${queryName}.deletedAt is not null`);
            }
        }
        if (callback) return callback(qb);
        return qb;
    }

    /**
     * @description 如果是树形模型,则此方法返回父项
     * @protected
     * @param {string} [id]
     * @returns {*}
     */
    // protected async getParent(id?: string) {
    //     if (this.repository instanceof BaseTreeRepository) {
    //         let parent: E | undefined;
    //         if (id !== undefined) {
    //             if (id === null) return id;
    //             return this.repository.findOneOrFail(id);
    //         }
    //         return parent;
    //     }
    //     throw new ForbiddenException(
    //         'Parent to get should only its entity is tree!',
    //     );
    // }
}
