import { Body, Controller, Post } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { Crud } from '@/modules/core/decorators';

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
        'list',
        'detail',
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
    async store(@Body() data: CreatePostDto): Promise<PostEntity> {
        return this.service.create(data);
    }
}
