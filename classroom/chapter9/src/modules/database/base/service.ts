import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { isNil } from 'lodash';
import { IPaginationMeta, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { In, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { QueryTrashMode, TreeChildrenResolve } from '../constants';
import { manualPaginate } from '../helpers';
import { QueryHook, ServiceListQueryParams, QueryParams, IPaginateDto } from '../types';

import { BaseRepository } from './repository';
import { BaseTreeRepository } from './tree.repository';

/**
 *  CURD操作服务
 */
export abstract class BaseService<
    E extends ObjectLiteral,
    R extends BaseRepository<E> | BaseTreeRepository<E>,
    P extends ServiceListQueryParams<E> = ServiceListQueryParams<E>,
    M extends IPaginationMeta = IPaginationMeta,
> {
    /**
     * 服务默认存储类
     */
    protected repository: R;

    /**
     * 是否开启软删除功能
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
     * 获取数据列表
     * @param params 查询参数
     * @param callback 回调查询
     */
    async list(params?: P, callback?: QueryHook<E>): Promise<E[]> {
        const options = params ?? ({} as P);
        // @ts-ignore
        const queryName = this.repository.getQBName();
        const trashed =
            'trashed' in options && options.trashed ? options.trashed : QueryTrashMode.NONE;
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
     * 获取分页数据
     * @param options 分页选项
     * @param callback 回调查询
     */
    async paginate(
        options: IPaginateDto<M> & P,
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
     * 获取数据详情
     * @param id
     * @param trashed 查询时是否包含已软删除的数据
     * @param callback 回调查询
     */
    async detail(id: string, trashed?: boolean, callback?: QueryHook<E>): Promise<E> {
        let qb = await this.buildItemQuery(this.repository.buildBaseQuery(), callback);
        qb.where(`${this.repository.getQBName()}.id = :id`, { id });
        if (callback) qb = await callback(qb);
        if (trashed) qb.withDeleted();
        const item = await qb.getOne();
        if (!item) throw new NotFoundException(`${this.repository.getQBName()} ${id} not exists!`);
        return item;
    }

    /**
     * 创建数据,如果子类没有实现则抛出404
     * @param data 请求数据
     * @param others 其它参数
     */
    create(data: any, ...others: any[]): Promise<E> {
        throw new ForbiddenException(`Can not to create ${this.repository.getQBName()}!`);
    }

    /**
     * 更新数据,如果子类没有实现则抛出404
     * @param data 请求数据
     * @param others 其它参数
     */
    update(data: any, ...others: any[]): Promise<E> {
        throw new ForbiddenException(`Can not to update ${this.repository.getQBName()}!`);
    }

    /**
     * 批量删除数据
     * @param data 需要删除的id列表
     * @param trash 是否只扔到回收站,如果为true则软删除
     */
    async delete(data: string[], trash?: boolean) {
        let items: E[] = [];
        if (this.repository instanceof BaseTreeRepository<E>) {
            items = await this.repository.find({
                where: { id: In(data) } as any,
                withDeleted: this.enable_trash ? true : undefined,
                relations: ['parent', 'children'],
            });
            if (this.repository.getChildrenResolve() !== TreeChildrenResolve.DELETE) {
                for (const item of items) {
                    if (isNil(item.children) || item.children.length <= 0) continue;
                    const nchildren = [...item.children].map((c) => {
                        c.parent = item.parent;
                        return item;
                    });
                    await this.repository.save(nchildren);
                }
            }
        } else {
            items = await this.repository.find({
                where: { id: In(data) } as any,
                withDeleted: this.enable_trash ? true : undefined,
            });
        }
        if (this.enable_trash && trash) {
            const directs = items.filter((item) => !isNil(item.deletedAt));
            const softs = items.filter((item) => isNil(item.deletedAt));
            return [
                ...(await this.repository.remove(directs)),
                ...(await this.repository.softRemove(softs)),
            ];
        }
        return this.repository.remove(items);
    }

    /**
     * 批量恢复回收站中的数据
     * @param data 需要恢复的id列表
     */
    async restore(data: string[]) {
        if (!this.enable_trash) {
            throw new ForbiddenException(
                `Can not to retore ${this.repository.getQBName()},because trash not enabled!`,
            );
        }
        const items = await this.repository.find({
            where: { id: In(data) } as any,
            withDeleted: true,
        });
        const trasheds = items.filter((item) => !isNil(item)).map((item) => item.id);
        await this.repository.restore(trasheds);
        return this.list(undefined, async (qb) => qb.andWhereInIds(trasheds));
    }

    /**
     * 获取查询单个项目的QueryBuilder
     * @param querybuilder实例
     * @param callback 查询回调
     */
    protected async buildItemQuery(qb: SelectQueryBuilder<E>, callback?: QueryHook<E>) {
        if (callback) {
            return callback(qb);
        }
        return qb;
    }

    /**
     * 获取查询数据列表的 QueryBuilder
     * @param qb querybuilder实例
     * @param options 查询选项
     * @param callback 查询回调
     */
    protected async buildListQuery(qb: SelectQueryBuilder<E>, options: P, callback?: QueryHook<E>) {
        const queryName = this.repository.getQBName();
        const trashed = 'trashed' in options ? options.trashed : undefined;
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
}
