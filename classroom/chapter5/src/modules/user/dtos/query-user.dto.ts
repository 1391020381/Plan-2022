import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { tNumber } from '@/modules/core/helpers';
import { PaginateDto, TrashedDto } from '@/modules/core/types';

import { QueryTrashMode } from '../../core/constants';

/**
 * 分页户列表查询验证
 */
@Injectable()
@DtoValidation({ type: 'query' })
export class QueryUserDto implements PaginateDto, TrashedDto {
    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;

    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;
}
