import { Get, Body, Controller, Delete, SerializeOptions, Query } from '@nestjs/common';

import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators/permission.decorator';
import { PermissionChecker } from '@/modules/rbac/types';

import { DeleteDto } from '@/modules/restful/dtos';

import { ManageQueryCommentDto } from '../../dtos/manage/query-comment.dto';
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
        query: ManageQueryCommentDto,
    ) {
        return this.commentService.paginate(query);
    }

    @Delete(':comment')
    @Permission(...checkes)
    async delete(
        @Body()
        { items }: DeleteDto,
    ) {
        return this.commentService.delete(items);
    }
}
