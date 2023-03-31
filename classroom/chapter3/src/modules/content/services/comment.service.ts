import { Injectable } from '@nestjs/common';
import { isNil, unset } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { manualPaginate } from '@/modules/core/helpers';

import { PaginateDto } from '@/modules/core/types';

import { CreateCommentDto } from '../dtos';

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
    ) {}

    async findTrees({ post }: { post?: string }) {
        return this.commentRepository.findTrees({ post });
    }

    /**
     * 查找一篇文章的评论
     * @param param0
     */
    async paginate(options: PaginateDto, post?: string) {
        const data = (await this.commentRepository.findRoots({ relations: ['post'] })).filter((c) =>
            !isNil(post) ? c.post.id === post : true,
        );
        let comments: CommentEntity[] = [];
        for (let i = 0; i < data.length; i++) {
            const c = data[i];
            unset(c, 'post');
            comments.push(await this.commentRepository.findDescendantsTree(c));
        }
        comments = await this.commentRepository.toFlatTrees(comments);
        return manualPaginate(options, comments);
    }

    /**
     * @description 新增评论
     * @param {CreateCommentDto} data
     */
    async create(data: CreateCommentDto) {
        const item = await this.commentRepository.save({
            ...data,
            parent: await this.getParent(data.parent),
            post: await this.getPost(data.post),
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
