import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
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
import { checkOwner, simpleCurdOption } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';
import { BaseController } from '@/modules/restful/base.controller';

import { Crud, Depends } from '@/modules/restful/decorators';
import { DeleteDto } from '@/modules/restful/dtos';

import { Guest, ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import { ContentModule } from '../content.module';
import {
    CreatePostDto,
    CreatePostWithOutTypeDto,
    QueryPostDto,
    UpdatePostDto,
    UpdatePostWithOutTypeDto,
} from '../dtos/post.dto';
import { PostEntity } from '../entities/post.entity';
import { PostRepository } from '../repositories/post.repository';
import { PostService } from '../services/post.service';
import { PostTypeOption } from '../types';

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
@Crud(async (configure) => {
    const type = await configure.get<PostTypeOption>('content.postType', 'markdown');
    return {
        id: 'post',
        enabled: [
            {
                name: 'store',
                option: simpleCurdOption([createChecker], '新增一篇文章'),
            },
            {
                name: 'update',
                option: simpleCurdOption([ownerChecker], '修改一篇文章的信息(必须是文章作者)'),
            },
        ],
        dtos: {
            list: QueryPostDto,
            store: type === 'all' ? CreatePostDto : CreatePostWithOutTypeDto,
            update: type === 'all' ? UpdatePostDto : UpdatePostWithOutTypeDto,
        },
    };
})
export class PostController extends BaseController<PostService> {
    constructor(protected service: PostService) {
        super(service);
    }

    @Get()
    @Guest()
    @ApiOperation({ summary: '查询文章列表,分页展示' })
    @SerializeOptions({ groups: ['post-list'] })
    async list(@Query() options: QueryPostDto, @ReqUser() author: ClassToPlain<UserEntity>) {
        options.trashed = QueryTrashMode.NONE;
        return this.service.paginate(
            omit(options, ['author', 'isPublished']),
            queryListCallback(options, author),
        );
    }

    @Get(':item')
    @Guest()
    @ApiOperation({ summary: '查询文章详情' })
    @SerializeOptions({ groups: ['post-detail'] })
    async show(
        @Param('item', new ParseUUIDPipe())
        item: string,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ) {
        return this.service.detail(item, false, queryItemCallback(author));
    }

    async store(
        @Body() data: CreatePostDto | CreatePostWithOutTypeDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<PostEntity> {
        return this.service.create({ ...data, author: user.id });
    }

    async update(@Body() data: UpdatePostDto | UpdatePostWithOutTypeDto) {
        return this.service.update(omit(data, 'author'));
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
        return this.service.delete(items, false);
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
