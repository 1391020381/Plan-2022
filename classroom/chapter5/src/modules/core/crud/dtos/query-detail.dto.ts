import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { tBoolean } from '../../helpers';
/**
 * 详情查询
 */
@Injectable()
export class QueryDetailDto {
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    trashed?: boolean;
}
