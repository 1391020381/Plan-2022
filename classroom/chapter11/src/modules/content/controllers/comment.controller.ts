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

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { In } from 'typeorm';

import { ClassToPlain } from '@/modules/core/types';
import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators/permission.decorator';
import { checkOwner } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';
import { Depends } from '@/modules/restful/decorators';
import { DeleteDto } from '@/modules/restful/dtos';

import { Guest, ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import { ContentModule } from '../content.module';
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
@ApiTags('评论操作')
@Depends(ContentModule)
@Controller('comments')
export class CommentController {
    constructor(protected commentService: CommentService) {}

    @Guest()
    @Get('tree/:post')
    @ApiOperation({ summary: '查询一篇文章的评论,以树形嵌套结构展示' })
    @SerializeOptions({})
    async index(@Param('post', new ParseUUIDPipe()) post: string) {
        return this.commentService.findTrees({ post });
    }

    /**
     * @description 显示评论树
     */
    @Guest()
    @Get()
    @ApiOperation({ summary: '查询一篇文章的评论,以分页模式展示' })
    @SerializeOptions({})
    async list(
        @Query()
        query: QueryCommentDto,
    ) {
        return this.commentService.paginate(query);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: '评论一篇文章' })
    @Permission(checkers.create)
    async store(
        @Body()
        data: CreateCommentDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.commentService.create(data, user);
    }

    @Delete()
    @ApiBearerAuth()
    @ApiOperation({ summary: '删除多条自己发布的评论' })
    @Permission(checkers.owner)
    async delete(
        @Body()
        { items }: DeleteDto,
    ) {
        return this.commentService.delete(items);
    }
}
