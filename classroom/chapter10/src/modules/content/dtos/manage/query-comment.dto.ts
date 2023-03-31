import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { IsModelExist } from '@/modules/database/constraints';
import { ListQueryDto } from '@/modules/restful/dtos';

import { UserEntity } from '@/modules/user/entities';

import { PostEntity } from '../../entities';
/**
 * 评论列表分页查询验证
 */
@DtoValidation({ type: 'query' })
export class ManageQueryCommentDto extends OmitType(ListQueryDto, ['trashed']) {
    @ApiPropertyOptional({
        description: '评论发布者ID:根据传入评论发布者的ID对评论进行过滤',
    })
    @IsModelExist(UserEntity, {
        message: '所属的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    user?: string;

    @ApiPropertyOptional({
        description: '评论所属文章ID:根据传入评论所属文章的ID对评论进行过滤',
    })
    @IsModelExist(PostEntity, {
        message: '所属的文章不存在',
    })
    @IsUUID(undefined, { message: '分类ID格式错误' })
    @IsOptional()
    post?: string;
}
