import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { PostEntity } from '../entities';

import { CreatePostDto } from './create-post.dto';

/**
 * 文章更新验证
 */
@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsModelExist(PostEntity, {
        groups: ['update'],
        message: '指定的文章不存在',
    })
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    id!: string;
}
