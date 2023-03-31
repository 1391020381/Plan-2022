import { Injectable } from '@nestjs/common';

import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

import { tNumber } from '@/helpers';
import { PaginateDto } from '@/helpers/types';
import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { UserEntity } from '@/modules/user/entities';

import { PostEntity } from '../entities';
/**
 * 评论列表分页查询验证
 */
@Injectable()
@DtoValidation({ type: 'query' })
export class QueryCommentDto implements PaginateDto {
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

    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;
}
