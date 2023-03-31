import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { tBoolean } from '@/modules/core/helpers';

/**
 * 数据删除
 */
@Injectable()
@DtoValidation()
export class DeleteDto {
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean;
}
