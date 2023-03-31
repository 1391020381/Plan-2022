import { Injectable } from '@nestjs/common';
import { IsDefined, IsUUID } from 'class-validator';

/**
 * 批量恢复验证
 */
@Injectable()
export class DeleteRestoreDto {
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
