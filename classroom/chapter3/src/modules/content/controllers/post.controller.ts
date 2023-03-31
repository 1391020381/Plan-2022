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

import { CreatePostDto, QueryPostDto, UpdatePostDto } from '../dtos';

import { PostService } from '../services';

/**
 * 文章控制器
 *
 * @export
 * @class PostController
 */

@Controller('posts')
export class PostController {
    constructor(protected postService: PostService) {}

    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    async list(@Query() options: QueryPostDto) {
        return this.postService.paginate(options);
    }

    @Get(':item')
    @SerializeOptions({ groups: ['post-detail'] })
    async detail(
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.postService.detail(item);
    }

    @Post()
    @SerializeOptions({ groups: ['post-detail'] })
    async store(
        @Body()
        data: CreatePostDto,
    ) {
        return this.postService.create(data);
    }

    @Patch()
    @SerializeOptions({ groups: ['post-detail'] })
    async update(
        @Body()
        data: UpdatePostDto,
    ) {
        return this.postService.update(data);
    }

    @Delete(':item')
    @SerializeOptions({ groups: ['post-detail'] })
    async delete(
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.postService.delete(item);
    }
}
