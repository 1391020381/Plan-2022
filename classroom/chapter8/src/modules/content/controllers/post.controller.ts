import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { isNil, omit } from 'lodash';

import { In, IsNull, Not } from 'typeorm';

import { QueryTrashMode } from '@/modules/core/constants';
import { BaseController, DeleteDto, DeleteMultiDto, QueryDetailDto } from '@/modules/core/crud';

import { ClassToPlain, QueryHook } from '@/modules/core/types';
import { PermissionAction } from '@/modules/rbac/constants';
import { RbacCrud } from '@/modules/rbac/decorators';
import { PermissionChecker, RbacCurdOption } from '@/modules/rbac/types';
import { ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { checkOwner } from '../../rbac/helpers';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';
import { PostEntity } from '../entities/post.entity';
import { PostRepository } from '../repositories';
import { PostService } from '../services';

const createChecker: PermissionChecker = async (ab) =>
    ab.can(PermissionAction.CREATE, PostEntity.name);

const ownerChecker: PermissionChecker = async (ab, ref, request) =>
    checkOwner(
        ab,
        async (items) =>
            ref.get(PostRepository, { strict: false }).find({
                relations: ['author'],
                where: { id: In(items) },
            }),
        request,
    );

const option: RbacCurdOption = {
    rbac: [ownerChecker],
};

/**
 * 文章控制器
 */
@RbacCrud({
    id: 'post',
    enabled: [
        { name: 'list', option: { allowGuest: true } },
        { name: 'detail', option: { allowGuest: true } },
        { name: 'store', option: { rbac: [createChecker] } },
        { name: 'update', option },
        { name: 'delete', option },
        { name: 'deleteMulti', option },
    ],
    dtos: {
        query: QueryPostDto,
        create: CreatePostDto,
        update: UpdatePostDto,
    },
})
@Controller('content/posts')
export class PostController extends BaseController<PostService> {
    constructor(protected postService: PostService) {
        super(postService);
    }

    @Get()
    async list(@Query() options: QueryPostDto, @ReqUser() author: ClassToPlain<UserEntity>) {
        options.trashed = QueryTrashMode.NONE;
        return this.postService.paginate(
            omit(options, ['author', 'isPublished']),
            queryListCallback(options, author),
        );
    }

    @Get(':item')
    async detail(
        @Query() { trashed }: QueryDetailDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ) {
        return this.postService.detail(item, false, queryItemCallback(author));
    }

    @Post()
    async store(
        @Body() data: CreatePostDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<PostEntity> {
        return this.service.create({ ...data, author: user.id });
    }

    @Patch()
    async update(@Body() data: UpdatePostDto) {
        return this.postService.update(omit(data, 'author'));
    }

    @Delete(':item')
    async delete(
        @Param('item', new ParseUUIDPipe())
        item: string,
        @Body()
        { trash }: DeleteDto,
    ) {
        return this.postService.delete(item, false);
    }

    @Delete()
    async deleteMulti(
        @Query()
        options: QueryPostDto,
        @Body()
        { trash, items }: DeleteMultiDto,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ) {
        return this.postService.deletePaginate(items, options, false, async (qb) =>
            qb.where({ 'author.id': author.id }),
        );
    }
}

const queryPublished = (isPublished?: boolean) => {
    if (typeof isPublished === 'boolean') {
        return isPublished ? { publishedAt: Not(IsNull()) } : { publishedAt: IsNull() };
    }
    return {};
};

/**
 * 在查询列表时,只有自己才能查看自己未发布的文章
 * @param options
 * @param author
 */
const queryListCallback: (
    options: QueryPostDto,
    author: ClassToPlain<UserEntity>,
) => QueryHook<PostEntity> = (options, author) => async (qb) => {
    if (!isNil(author)) {
        if (isNil(options.author)) {
            return qb
                .where({ author: author.id, ...queryPublished(options.isPublished) })
                .orWhere({ publishedAt: Not(IsNull()) });
        }
        return qb.where(
            options.author !== author.id
                ? queryPublished(options.isPublished)
                : { publishedAt: Not(IsNull()) },
        );
    }
    return qb.where({ publishedAt: Not(IsNull()) });
};

/**
 * 在查询文章详情时,只有自己才能查看自己未发布的文章
 * @param author
 */
const queryItemCallback: (author: ClassToPlain<UserEntity>) => QueryHook<PostEntity> =
    (author) => async (qb) => {
        if (!isNil(author)) {
            return qb.andWhere({ 'author.id': author.id }).orWhere({ publishedAt: Not(IsNull()) });
        }
        return qb.andWhere({ publishedAt: Not(IsNull()) });
    };
