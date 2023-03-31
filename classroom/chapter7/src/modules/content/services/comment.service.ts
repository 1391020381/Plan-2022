import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { manualPaginate } from '@/helpers';

import { ClassToPlain } from '@/modules/core/types';

import { UserEntity } from '@/modules/user/entities';
import { UserService } from '@/modules/user/services';

import { CreateCommentDto, QueryCommentDto } from '../dtos';

import { CommentEntity } from '../entities';
import { CommentRepository, PostRepository } from '../repositories';

/**
 * @description 评论服务
 * @export
 * @class CommentService
 */
@Injectable()
export class CommentService {
    constructor(
        protected commentRepository: CommentRepository,
        protected postRepository: PostRepository,
        protected userService: UserService,
    ) {}

    async findTrees({ post }: { post?: string }) {
        return this.commentRepository.findTrees({ post });
    }

    /**
     * 查找一篇文章的评论
     * @param param0
     */
    async paginate({ post, user, ...query }: QueryCommentDto) {
        const data = await this.commentRepository.findRoots({
            addQuery: (qb) => {
                const condition: Record<string, string> = {};
                if (!isNil(post)) condition.post = post;
                if (!isNil(user)) condition.user = user;
                return Object.keys(condition).length > 0 ? qb.andWhere(condition) : qb;
            },
        });
        let comments: CommentEntity[] = [];
        for (let i = 0; i < data.length; i++) {
            const c = data[i];
            comments.push(await this.commentRepository.findDescendantsTree(c));
        }
        comments = await this.commentRepository.toFlatTrees(comments);
        return manualPaginate(query, comments);
    }

    /**
     * @description 新增评论
     * @param {CreateCommentDto} data
     */
    async create(data: CreateCommentDto, user: ClassToPlain<UserEntity>) {
        const item = await this.commentRepository.save({
            ...data,
            parent: await this.getParent(data.parent),
            post: await this.getPost(data.post),
            user: await this.userService.getCurrentUser(user),
        });
        return this.commentRepository.findOneOrFail({ where: { id: item.id } });
    }

    /**
     * @description 删除评论
     * @param {string} id
     */
    async delete(id: string) {
        const comment = await this.commentRepository.findOneOrFail({ where: { id } });
        return this.commentRepository.remove(comment);
    }

    /**
     * 批量删除评论
     * @param ids
     * @param query
     */
    async deleteMullti(ids: string[], query: QueryCommentDto) {
        for (const id of ids) {
            await this.delete(id);
        }
        return this.paginate(query);
    }

    /**
     * @description 获取评论所属文章实例
     * @protected
     * @param {string} id
     */
    protected async getPost(id: string) {
        return this.postRepository.findOneOrFail({ where: { id } });
    }

    /**
     * @description 获取请求传入的父评论
     * @protected
     * @param {string} [id]
     */
    protected async getParent(id?: string) {
        let parent: CommentEntity | undefined;
        if (id !== undefined) {
            if (id === null) return null;
            parent = await this.commentRepository.findOne({ where: { id } });
            if (!parent) {
                throw new EntityNotFoundError(CommentEntity, `Parent comment ${id} not exists!`);
            }
        }
        return parent;
    }
}
