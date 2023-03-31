import {
    Get,
    Body,
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    Post,
    SerializeOptions,
    Query,
} from '@nestjs/common';

import { In } from 'typeorm';

import { OptionalUUIDPipe } from '@/modules/core/pipes';
import { ClassToPlain } from '@/modules/core/types';

import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators';
import { checkOwner } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';
import { Guest, ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { CreateCommentDto, DeleteCommentMultiDto, QueryCommentDto } from '../dtos';
import { CommentEntity } from '../entities';
import { CommentRepository } from '../repositories';
import { CommentService } from '../services';

const checkers: Record<'create' | 'owner', PermissionChecker> = {
    create: async (ab) => ab.can(PermissionAction.CREATE, CommentEntity.name),
    owner: async (ab, ref, request) =>
        checkOwner(
            ab,
            async (items) =>
                ref.get(CommentRepository, { strict: false }).find({
                    relations: ['user'],
                    where: { id: In(items) },
                }),
            request,
        ),
};
/**
 * 评论控制器
 */
@Controller('content/comments')
export class CommentController {
    constructor(protected commentService: CommentService) {}

    @Guest()
    @Get('tree/:post?')
    @SerializeOptions({})
    async index(@Param('post', new OptionalUUIDPipe()) post?: string) {
        return this.commentService.findTrees({ post });
    }

    /**
     * @description 显示评论树
     */
    @Guest()
    @Get()
    @SerializeOptions({})
    async list(
        @Query()
        query: QueryCommentDto,
    ) {
        return this.commentService.paginate(query);
    }

    @Post()
    @Permission(checkers.create)
    async store(
        @Body()
        data: CreateCommentDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.commentService.create(data, user);
    }

    @Delete(':id')
    @Permission(checkers.owner)
    async delete(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.commentService.delete(id);
    }

    @Delete()
    @Permission(checkers.owner)
    async deleteMulti(
        @Query()
        query: QueryCommentDto,
        @Body()
        { items }: DeleteCommentMultiDto,
    ) {
        return this.commentService.deleteMullti(items, query);
    }
}
