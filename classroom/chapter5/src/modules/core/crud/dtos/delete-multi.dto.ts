import { Injectable } from '@nestjs/common';
import { IsDefined, IsUUID } from 'class-validator';

import { DeleteDto } from './delete.dto';

/**
 * 批量删除验证
 */
@Injectable()
export class DeleteMultiDto extends DeleteDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    items: string[] = [];
}
