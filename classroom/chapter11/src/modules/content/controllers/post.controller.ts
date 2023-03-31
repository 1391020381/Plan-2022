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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isNil, omit } from 'lodash';

import { In, IsNull, Not } from 'typeorm';

import { ClassToPlain } from '@/modules/core/types';
import { QueryTrashMode } from '@/modules/database/constants';
import { QueryHook } from '@/modules/database/types';
import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators/permission.decorator';
import { checkOwner } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';

import { Depends } from '@/modules/restful/decorators';
import { DeleteDto } from '@/modules/restful/dtos';

import { ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import { DetailQueryDto } from '../../restful/dtos/detail-query.dto';
import { ContentModule } from '../content.module';
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
@ApiTags('文章操作')
@Depends(ContentModule)
@Controller('posts')
export class PostController {
    constructor(protected postService: PostService) {}

    @Get()
    @ApiOperation({ summary: '查询文章列表,分页展示' })
    @SerializeOptions({ groups: ['post-list'] })
    async list(@Query() options: QueryPostDto, @ReqUser() author: ClassToPlain<UserEntity>) {
        options.trashed = QueryTrashMode.NONE;
        return this.postService.paginate(
            omit(options, ['author', 'isPublished']),
            queryListCallback(options, author),
        );
    }

    @Get(':item')
    @ApiOperation({ summary: '查询文章详情' })
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
    @ApiBearerAuth()
    @ApiOperation({ summary: '新增一篇文章' })
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(createChecker)
    async store(
        @Body() data: CreatePostDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<PostEntity> {
        return this.postService.create({ ...data, author: user.id });
    }

    @Patch()
    @ApiBearerAuth()
    @ApiOperation({ summary: '修改一篇文章的信息(必须是文章作者)' })
    @SerializeOptions({ groups: ['post-detail'] })
    @Permission(ownerChecker)
    async update(@Body() data: UpdatePostDto) {
        return this.postService.update(omit(data, 'author'));
    }

    @Delete(':item')
    @ApiBearerAuth()
    @ApiOperation({ summary: '删除文章(必须是文章作者),支持批量删除' })
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
