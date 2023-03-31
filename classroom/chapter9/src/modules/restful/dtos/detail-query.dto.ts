import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { tBoolean } from '@/modules/core/helpers';

/**
 * 详情查询
 */
@Injectable()
export class DetailQueryDto {
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    trashed?: boolean;
}
