import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { tNumber } from '@/helpers';
import { PaginateDto } from '@/helpers/types';
import { QueryTrashMode } from '@/modules/core/constants';
import { DtoValidation } from '@/modules/core/decorators';
import { TrashedDto } from '@/modules/core/types';

/**
 * 分类列表分页查询验证
 */
@DtoValidation({ type: 'query' })
export class ManageQueryCategoryDto implements PaginateDto, TrashedDto {
    @Transform(({ value }) => tNumber(value))
    @IsNumber()
    @Min(1, { message: '当前页必须大于1' })
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
