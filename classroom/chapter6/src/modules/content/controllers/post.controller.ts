import { Body, Controller, Post } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { Crud } from '@/modules/core/decorators';

import { ClassToPlain } from '@/modules/core/types';
import { ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';
import { PostEntity } from '../entities/post.entity';
import { PostService } from '../services';

/**
 * 文章控制器
 *
 * @export
 * @class PostController
 */
@Crud({
    id: 'post',
    enabled: [
        { name: 'list', option: { allowGuest: true } },
        { name: 'detail', option: { allowGuest: true } },
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        query: QueryPostDto,
        create: CreatePostDto,
        update: UpdatePostDto,
    },
})
@Controller('posts')
export class PostController extends BaseController<PostService> {
    constructor(protected postService: PostService) {
        super(postService);
    }

    @Post()
    async store(
        @Body() data: CreatePostDto,
        @ReqUser() author: ClassToPlain<UserEntity>,
    ): Promise<PostEntity> {
        return this.service.create({ data, author });
    }
}
