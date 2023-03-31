import {
    Get,
    Body,
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    SerializeOptions,
    Query,
} from '@nestjs/common';

import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators';
import { PermissionChecker } from '@/modules/rbac/types';

import { DeleteCommentMultiDto, QueryCommentDto } from '../../dtos';
import { CommentEntity } from '../../entities/comment.entity';
import { CommentService } from '../../services';

const checkes: PermissionChecker[] = [
    async (ab) => ab.can(PermissionAction.MANAGE, CommentEntity.name),
];
/**
 * 评论控制器
 */
@Controller('manage/content/comments')
export class CommentManageController {
    constructor(protected commentService: CommentService) {}

    /**
     * @description 显示评论树
     */
    @Get()
    @Permission(...checkes)
    @SerializeOptions({})
    async list(
        @Query()
        query: QueryCommentDto,
    ) {
        return this.commentService.paginate(query);
    }

    @Delete(':comment')
    @Permission(...checkes)
    async delete(
        @Param('comment', new ParseUUIDPipe())
        comment: string,
    ) {
        return this.commentService.delete(comment);
    }

    @Delete()
    @Permission(...checkes)
    async deleteMulti(
        @Query()
        query: QueryCommentDto,
        @Body()
        { items }: DeleteCommentMultiDto,
    ) {
        return this.commentService.deleteMullti(items, query);
    }
}
