import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsOptional,
    IsUUID,
    MaxLength,
    ValidateIf,
    IsNumber,
    Min,
} from 'class-validator';
import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';
import { IsDataExist } from '@/modules/database/constraints';
import { PaginateOptions } from '@/modules/database/types';

import { CommentEntity, PostEntity } from '../entities';

/**
 * 评论分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryCommentDto implements PaginateOptions {
    @IsDataExist(PostEntity, {
        message: '所属的文章不存在',
    })
    @IsUUID(undefined, { message: '分类ID格式错误' })
    @IsOptional()
    post?: string;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;
}

/**
 * 评论树查询
 */
@DtoValidation({ type: 'query' })
export class QueryCommentTreeDto extends PickType(QueryCommentDto, ['post']) {}

/**
 * 评论添加验证
 */
@DtoValidation()
export class CreateCommentDto {
    @MaxLength(1000, { message: '评论内容不能超过$constraint1个字' })
    @IsNotEmpty({ message: '评论内容不能为空' })
    body!: string;

    @IsDataExist(PostEntity, { message: '指定的文章不存在' })
    @IsUUID(undefined, { message: '文章ID格式错误' })
    @IsDefined({ message: '评论文章ID必须指定' })
    post!: string;

    @IsDataExist(CommentEntity, { message: '父评论不存在' })
    @IsUUID(undefined, { message: '父评论ID格式不正确' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional()
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;
}
