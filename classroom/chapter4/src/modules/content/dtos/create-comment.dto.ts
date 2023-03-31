import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength, ValidateIf } from 'class-validator';

import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { CommentEntity, PostEntity } from '../entities';

/**
 * 添加评论数据验证
 */
@Injectable()
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
