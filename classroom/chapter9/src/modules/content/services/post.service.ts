import { Injectable } from '@nestjs/common';

import { isNil, omit } from 'lodash';

import { In, IsNull, Not, SelectQueryBuilder } from 'typeorm';

import { ClassToPlain } from '@/modules/core/types';

import { BaseService } from '@/modules/database/base';
import { manualPaginate } from '@/modules/database/helpers';
import { QueryHook } from '@/modules/database/types';
import { UserEntity } from '@/modules/user/entities';
import { UserService } from '@/modules/user/services';

import { PostOrderType } from '../constants';
import { ManageCreatePostDto } from '../dtos/manage/create-post.dto';
import { ManageUpdatePostDto } from '../dtos/manage/update-post.dto';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos/post.dto';
import { PostEntity } from '../entities/post.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { PostRepository } from '../repositories/post.repository';

import { CategoryService } from './category.service';
import { PostSearchService } from './search.service';

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
export class PostService extends BaseService<PostEntity, PostRepository, FindParams> {
    protected enable_trash = true;

    constructor(
        protected postRepository: PostRepository,
        private categoryRepository: CategoryRepository,
        private categoryService: CategoryService,
        private userService: UserService,
        private searchService: PostSearchService,
    ) {
        super(postRepository);
    }

    async search(options: QueryPostDto) {
        const { search: text, page, limit } = options;
        const results = await this.searchService.search(text);
        const ids = results.map((result) => result.id);
        const posts =
            ids.length <= 0 ? [] : await this.postRepository.find({ where: { id: In(ids) } });
        return manualPaginate({ page, limit }, posts);
    }

    /**
     * @description 添加文章
     * @param {CreatePostDto} data
     */
    async create({ author, ...data }: (CreatePostDto & { author: string }) | ManageCreatePostDto) {
        const createPostDto = {
            ...data,
            author: await this.userService.getCurrentUser({
                id: author,
            } as ClassToPlain<UserEntity>),
            // 文章所属分类
            categories: data.categories
                ? await this.categoryRepository.findBy({
                      id: In(data.categories),
                  })
                : [],
        };
        const item = await this.repository.save(createPostDto);
        try {
            await this.searchService.create(item);
        } catch (err) {
            console.log(err);
        }
        return this.detail(item.id);
    }

    /**
     * @description 更新文章
     * @param {UpdatePostDto} data
     */
    async update(data: UpdatePostDto | ManageUpdatePostDto) {
        const post = await this.detail(data.id);
        if (data.categories) {
            // 更新文章所属分类
            await this.repository
                .createQueryBuilder('post')
                .relation(PostEntity, 'categories')
                .of(post)
                .addAndRemove(data.categories, post.categories ?? []);
        }
        await this.repository.update(data.id, omit(data, ['id', 'categories']));
        await this.searchService.update(post);
        return this.detail(data.id);
    }

    async delete(items: string[], trash?: boolean) {
        const result = await super.delete(items, trash);
        for (const item of items) await this.searchService.remove(item);
        return result;
    }

    async restore(items: string[]) {
        const results = await super.restore(items);
        for (const item of results) await this.searchService.create(item);
        return results;
    }

    protected async buildListQuery(
        queryBuilder: SelectQueryBuilder<PostEntity>,
        options: FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        const { category, orderBy, isPublished, author } = options;
        let qb = queryBuilder;
        if (typeof isPublished === 'boolean') {
            qb = isPublished
                ? qb.where({
                      publishedAt: Not(IsNull()),
                  })
                : qb.where({
                      publishedAt: IsNull(),
                  });
        }
        if (!isNil(author)) {
            qb.where({
                'author.id': author,
            });
        }

        this.queryOrderBy(qb, orderBy);
        if (callback) {
            qb = await callback(qb);
        }
        if (category) {
            qb = await this.queryByCategory(category, qb);
        }
        return super.buildListQuery(qb, options);
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
            case PostOrderType.USERCUSTOM:
                return query.orderBy('userOrder', 'DESC');
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
