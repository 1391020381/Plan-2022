import { Injectable } from '@nestjs/common';

import { IsDefined, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

/**
 * 批量删除评论验证
 */
@Injectable()
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
