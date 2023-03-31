import { Injectable, NotFoundException } from '@nestjs/common';

import { omit } from 'lodash';

import { paginate } from 'nestjs-typeorm-paginate';
import { In, IsNull, Not, SelectQueryBuilder } from 'typeorm';

import { PaginateDto, QueryHook } from '@/modules/core/types';

import { PostOrderType } from '../constants';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';
import { PostEntity } from '../entities';
import { CategoryRepository, PostRepository } from '../repositories';

import { CategoryService } from './category.service';

// 文章查询接口
type FindParams = {
    [key in keyof Omit<QueryPostDto, 'limit' | 'page'>]: QueryPostDto[key];
};

/**
 * 文章服务
 *
 * @export
 * @class PostService
 */
@Injectable()
export class PostService {
    constructor(
        protected postRepository: PostRepository,
        private categoryRepository: CategoryRepository,
        private categoryService: CategoryService,
    ) {}

    /**
     * @description 添加文章
     * @param {CreatePostDto} data
     */
    async create(data: CreatePostDto) {
        const createPostDto = {
            ...data,
            // 文章所属分类
            categories: data.categories
                ? await this.categoryRepository.findBy({
                      id: In(data.categories),
                  })
                : [],
        };
        const item = await this.postRepository.save(createPostDto);
        return this.detail(item.id);
    }

    /**
     * @description 更新文章
     * @param {UpdatePostDto} data
     */
    async update(data: UpdatePostDto) {
        const post = await this.detail(data.id);
        if (data.categories) {
            // 更新文章所属分类
            await this.postRepository
                .createQueryBuilder('post')
                .relation(PostEntity, 'categories')
                .of(post)
                .addAndRemove(data.categories, post.categories ?? []);
        }
        await this.postRepository.update(data.id, omit(data, ['id', 'categories']));
        return this.detail(data.id);
    }

    /**
     * @description 使用自定义Repository构建基础查询
     * @protected
     * @param {QueryHook<PostEntity>} [callback]
     */
    protected async getItemQuery(callback?: QueryHook<PostEntity>) {
        let query = this.postRepository.buildBaseQuery();
        if (callback) query = await callback(query);
        return query;
    }

    protected async buildListQuery(
        queryBuilder: SelectQueryBuilder<PostEntity>,
        options: FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        const { category, orderBy, isPublished } = options;
        let qb = queryBuilder;
        // 是否根据发布状态查询
        if (typeof isPublished === 'boolean') {
            qb = isPublished
                ? qb.where({
                      publishedAt: Not(IsNull()),
                  })
                : qb.where({
                      publishedAt: IsNull(),
                  });
        }
        this.queryOrderBy(qb, orderBy);
        if (callback) {
            qb = await callback(qb);
        }
        if (category) {
            qb = await this.queryByCategory(category, qb);
        }
        if (callback) return callback(qb);
        return qb;
    }

    /**
     * 获取文章列表
     * @param params
     * @param callback
     */
    async list(params?: FindParams, callback?: QueryHook<PostEntity>) {
        const options = params ?? ({} as FindParams);
        const qb = await this.buildListQuery(
            this.postRepository.buildBaseQuery(),
            options,
            callback,
        );
        return qb.getMany();
    }

    /**
     * 获取分页文章列表数据
     * @param options
     * @param callback
     */
    async paginate(options: PaginateDto & FindParams, callback?: QueryHook<PostEntity>) {
        const queryOptions = options ?? ({} as PaginateDto & FindParams);
        const query = await this.buildListQuery(
            this.postRepository.buildBaseQuery(),
            queryOptions,
            callback,
        );
        return paginate(query, options);
    }

    /**
     * 获取文章详情
     * @param id
     * @param callback
     */
    async detail(id: string, callback?: QueryHook<PostEntity>) {
        const query = await this.buildItemQuery(this.postRepository.buildBaseQuery(), callback);
        const qb = query.where('post.id = :id', { id });
        const item = await qb.getOne();
        if (!item) throw new NotFoundException(`The post ${id} not exists!`);
        return item;
    }

    /**
     * 删除文章
     * @param id
     */
    async delete(id: string) {
        const item = await this.postRepository.findOneOrFail({
            where: { id },
        });
        return this.postRepository.remove(item);
    }

    /**
     * 获取查询单个项目的QueryBuilder
     * @param query
     * @param callback
     */
    protected async buildItemQuery(
        query: SelectQueryBuilder<PostEntity>,
        callback?: QueryHook<PostEntity>,
    ) {
        if (callback) return callback(query);
        return query;
    }

    /**
     * 对文章进行排序的Query构建
     *
     * @protected
     * @param {SelectQueryBuilder<PostEntity>} query
     * @param {PostOrderType} [orderBy]
     * @returns
     * @memberof PostService
     */
    protected queryOrderBy(query: SelectQueryBuilder<PostEntity>, orderBy?: PostOrderType) {
        switch (orderBy) {
            case PostOrderType.CREATED:
                return query.orderBy('post.createdAt', 'DESC');
            case PostOrderType.UPDATED:
                return query.orderBy('post.updatedAt', 'DESC');
            case PostOrderType.PUBLISHED:
                return query.orderBy('post.publishedAt', 'DESC');
            case PostOrderType.COMMENTCOUNT:
                return query.orderBy('commentCount', 'DESC');
            case PostOrderType.CUSTOM:
                return query.orderBy('customOrder', 'DESC');
            default:
                return query
                    .orderBy('post.createdAt', 'DESC')
                    .addOrderBy('post.updatedAt', 'DESC')
                    .addOrderBy('post.publishedAt', 'DESC')
                    .addOrderBy('commentCount', 'DESC');
        }
    }

    /**
     * 查询出分类及其后代分类下的所有文章的Query构建
     *
     * @param {string} id
     * @param {SelectQueryBuilder<PostEntity>} query
     * @returns
     * @memberof PostService
     */
    protected async queryByCategory(id: string, query: SelectQueryBuilder<PostEntity>) {
        const root = await this.categoryService.detail(id);
        const tree = await this.categoryRepository.findDescendantsTree(root);
        const flatDes = await this.categoryRepository.toFlatTrees(tree.children);
        const ids = [tree.id, ...flatDes.map((item) => item.id)];
        return query.where('categories.id IN (:...ids)', {
            ids,
        });
    }
}
