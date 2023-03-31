import { Get, Body, Controller, Delete, SerializeOptions, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PermissionAction } from '@/modules/rbac/constants';
import { Permission } from '@/modules/rbac/decorators/permission.decorator';
import { PermissionChecker } from '@/modules/rbac/types';

import { Depends } from '@/modules/restful/decorators';
import { DeleteDto } from '@/modules/restful/dtos';

import { ContentModule } from '../../content.module';
import { ManageQueryCommentDto } from '../../dtos/manage/query-comment.dto';
import { CommentEntity } from '../../entities/comment.entity';
import { CommentService } from '../../services';

const checkes: PermissionChecker[] = [
    async (ab) => ab.can(PermissionAction.MANAGE, CommentEntity.name),
];
/**
 * 评论控制器
 */
@ApiTags('评论管理')
@ApiBearerAuth()
@Depends(ContentModule)
@Controller('comments')
export class CommentManageController {
    constructor(protected commentService: CommentService) {}

    /**
     * @description 显示评论树
     */
    @Get()
    @ApiOperation({ summary: '查询评论列表' })
    @Permission(...checkes)
    @SerializeOptions({})
    async list(
        @Query()
        query: ManageQueryCommentDto,
    ) {
        return this.commentService.paginate(query);
    }

    @Delete(':comment')
    @ApiOperation({ summary: '删除评论,支持批量删除' })
    @Permission(...checkes)
    async delete(
        @Body()
        { items }: DeleteDto,
    ) {
        return this.commentService.delete(items);
    }
}
