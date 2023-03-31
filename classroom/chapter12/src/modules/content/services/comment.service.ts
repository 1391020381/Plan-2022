import { Injectable } from '@nestjs/common';

import { isNil } from 'lodash';

import { EntityNotFoundError, In } from 'typeorm';

import { ClassToPlain } from '@/modules/core/types';
import { manualPaginate } from '@/modules/database/helpers';

import { UserEntity } from '@/modules/user/entities';
import { UserService } from '@/modules/user/services';

import { CreateCommentDto, QueryCommentDto } from '../dtos/comment.dto';
import { ManageQueryCommentDto } from '../dtos/manage/query-comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository } from '../repositories/post.repository';

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
     * @param dto
     */
    async paginate(dto: ManageQueryCommentDto | QueryCommentDto) {
        const { post, user, ...query } = dto as ManageQueryCommentDto;
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
     * 删除评论
     * @param items
     */
    async delete(items: string[]) {
        const comments = await this.commentRepository.findOneOrFail({ where: { id: In(items) } });
        return this.commentRepository.remove(comments);
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
