import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength, ValidateIf } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { IsModelExist } from '@/modules/database/constraints';

import { CommentEntity, PostEntity } from '../entities';

import { ManageQueryCommentDto } from './manage/query-comment.dto';

/**
 * 评论列表分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryCommentDto extends OmitType(ManageQueryCommentDto, ['user']) {}

/**
 * 添加评论数据验证
 */
@DtoValidation()
export class CreateCommentDto {
    @ApiProperty({
        description: '评论内容',
        maximum: 1000,
    })
    @MaxLength(1000, { message: '评论内容不能超过$constraint1个字' })
    @IsNotEmpty({ message: '评论内容不能为空' })
    body!: string;

    @ApiProperty({
        description: '评论所属文章ID',
    })
    @IsModelExist(PostEntity, { always: true, message: '指定的文章不存在' })
    @IsUUID(undefined, { message: '文章ID格式错误' })
    @IsDefined({ message: '评论文章ID必须指定' })
    post!: string;

    @ApiProperty({
        description: '父级评论ID',
    })
    @IsModelExist(CommentEntity, { always: true, message: '父评论不存在' })
    @IsUUID(undefined, { always: true, message: '父评论ID格式不正确' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;
}
