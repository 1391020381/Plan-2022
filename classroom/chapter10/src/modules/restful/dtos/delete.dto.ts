import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
    @ApiProperty({
        description: '待删除的ID列表',
        type: [String],
    })
    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: 'ID必须指定',
    })
    items: string[] = [];

    @ApiPropertyOptional({
        description: '是否删除到回收站',
    })
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean;
}
