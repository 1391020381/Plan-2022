import { Controller } from '@nestjs/common';

import { BaseControllerWithTrash } from '@/modules/restful/base';
import { Crud } from '@/modules/restful/decorators';

import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';
import { PostService } from '../services/post.service';

@Crud({
    id: 'post',
    enabled: ['list', 'detail', 'store', 'update', 'delete', 'restore'],
    dtos: {
        store: CreatePostDto,
        update: UpdatePostDto,
        list: QueryPostDto,
    },
})
@Controller('posts')
export class PostController extends BaseControllerWithTrash<PostService> {
    constructor(protected service: PostService) {
        super(service);
    }
}
