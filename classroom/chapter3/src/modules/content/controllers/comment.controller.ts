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

import { OptionalUUIDPipe } from '@/modules/core/pipes';

import { CreateCommentDto, QueryCommentDto } from '../dtos';
import { CommentService } from '../services';

/**
 * 评论控制器
 *
 * @export
 * @class CommentController
 */
@Controller('comments')
export class CommentController {
    constructor(protected commentService: CommentService) {}

    @Get('tree/:post?')
    @SerializeOptions({})
    async index(@Param('post', new OptionalUUIDPipe()) post?: string) {
        return this.commentService.findTrees({ post });
    }

    /**
     * @description 显示评论树
     */
    @Get(':post?')
    @SerializeOptions({})
    async list(
        @Query()
        query: QueryCommentDto,
        @Param('post', new OptionalUUIDPipe())
        post?: string,
    ) {
        return this.commentService.paginate(query, post);
    }

    @Post()
    async store(
        @Body()
        data: CreateCommentDto,
    ) {
        return this.commentService.create(data);
    }

    @Delete(':comment')
    async delete(
        @Param('comment', new ParseUUIDPipe())
        comment: string,
    ) {
        return this.commentService.delete(comment);
    }
}
