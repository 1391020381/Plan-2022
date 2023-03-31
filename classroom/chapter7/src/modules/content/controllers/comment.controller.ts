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

import { ClassToPlain } from '@/modules/core/types';
import { Guest, ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { CreateCommentDto, QueryCommentDto } from '../dtos';
import { DeleteCommentMultiDto } from '../dtos/delete-comment-multi.dto';
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

    @Guest()
    @Get('tree/:post?')
    @SerializeOptions({})
    async index(@Param('post', new OptionalUUIDPipe()) post?: string) {
        return this.commentService.findTrees({ post });
    }

    /**
     * @description 显示评论树
     */
    @Guest()
    @Get()
    @SerializeOptions({})
    async list(
        @Query()
        query: QueryCommentDto,
    ) {
        return this.commentService.paginate(query);
    }

    @Post()
    async store(
        @Body()
        data: CreateCommentDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.commentService.create(data, user);
    }

    @Delete(':id')
    async delete(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.commentService.delete(id);
    }

    @Delete()
    async deleteMulti(
        @Query()
        query: QueryCommentDto,
        @Body()
        { items }: DeleteCommentMultiDto,
    ) {
        return this.commentService.deleteMullti(items, query);
    }
}
