import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

import { tNumber } from '@/helpers';
import { PaginateDto } from '@/helpers/types';
import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { UserEntity } from '@/modules/user/entities';

import { CommentEntity, PostEntity } from '../entities';
/**
 * 评论列表分页查询验证
 */
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

/**
 * 添加评论数据验证
 */
@DtoValidation()
export class CreateCommentDto {
    @MaxLength(1000, { message: '评论内容不能超过$constraint1个字' })
    @IsNotEmpty({ message: '评论内容不能为空' })
    body!: string;

    @IsModelExist(PostEntity, { always: true, message: '指定的文章不存在' })
    @IsUUID(undefined, { message: '文章ID格式错误' })
    @IsDefined({ message: '评论文章ID必须指定' })
    post!: string;

    @IsModelExist(CommentEntity, { always: true, message: '父评论不存在' })
    @IsUUID(undefined, { always: true, message: '父评论ID格式不正确' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;
}

/**
 * 批量删除评论验证
 */
@DtoValidation()
export class DeleteCommentMultiDto {
    @IsUUID(undefined, {
        each: true,
        message: '评论ID格式错误',
        groups: ['delete-multi'],
    })
    @IsDefined({
        each: true,
        groups: ['delete-multi'],
        message: '评论ID必须指定',
    })
    items: string[] = [];
}
