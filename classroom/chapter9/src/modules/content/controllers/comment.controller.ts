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

import { ClassToPlain } from '@/modules/core/types';
import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators/permission.decorator';
import { checkOwner } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';
import { DeleteDto } from '@/modules/restful/dtos';

import { Guest, ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import { CreateCommentDto, QueryCommentDto } from '../dtos';
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
    @Get('tree/:post')
    @SerializeOptions({})
    async index(@Param('post', new ParseUUIDPipe()) post: string) {
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

    @Delete()
    @Permission(checkers.owner)
    async delete(
        @Body()
        { items }: DeleteDto,
    ) {
        return this.commentService.delete(items);
    }
}
