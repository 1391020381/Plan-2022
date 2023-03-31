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
    SerializeOptions,
} from '@nestjs/common';
import { isNil, omit } from 'lodash';

import { In, IsNull, Not } from 'typeorm';

import { ClassToPlain } from '@/modules/core/types';
import { QueryTrashMode } from '@/modules/database/constants';
import { QueryHook } from '@/modules/database/types';
import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators/permission.decorator';
import { checkOwner } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';

import { DeleteDto } from '@/modules/restful/dtos';

import { ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import { DetailQueryDto } from '../../restful/dtos/detail-query.dto';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos/post.dto';
import { PostEntity } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';
import { PostService } from '../services/post.service';

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

/**
 * 文章控制器
 */
@Controller('content/posts')
export class PostController {
    constructor(protected postService: PostService) {}

    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    async list(@Query() options: QueryPostDto, @ReqUser() author: ClassToPlain<UserEntity>) {
        options.trashed = QueryTrashMode.NONE;
        return this.postService.paginate(
            omit(options, ['author', 'isPublished']),
            queryListCallback(options, author),
        );
    }

    @Get(':item')
    @SerializeOptions({ groups: ['post-detail'] })
    async detail(
        @Query() { trashed }: DetailQueryDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ) {
        return this.postService.detail(item, false, queryItemCallback(author));
    }

    @Post()
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(createChecker)
    async store(
        @Body() data: CreatePostDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<PostEntity> {
        return this.postService.create({ ...data, author: user.id });
    }

    @Patch()
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(ownerChecker)
    async update(@Body() data: UpdatePostDto) {
        return this.postService.update(omit(data, 'author'));
    }

    @Delete(':item')
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(ownerChecker)
    async delete(
        @Body()
        { items }: DeleteDto,
    ) {
        return this.postService.delete(items, false);
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
