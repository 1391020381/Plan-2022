import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { tBoolean } from '@/modules/core/helpers';

/**
 * 批量删除验证
 */
@Injectable()
@DtoValidation()
export class DeleteDto {
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    items: string[] = [];

    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean;
}
