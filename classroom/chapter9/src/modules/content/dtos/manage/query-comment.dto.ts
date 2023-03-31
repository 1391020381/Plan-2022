import { OmitType } from '@nestjs/swagger';
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
    @IsModelExist(UserEntity, {
        message: '所属的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    user?: string;

    @IsModelExist(PostEntity, {
        message: '所属的文章不存在',
    })
    @IsUUID(undefined, { message: '分类ID格式错误' })
    @IsOptional()
    post?: string;
}
