import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { tNumber } from '@/modules/core/helpers';
import { QueryTrashMode } from '@/modules/database/constants';
import { IPaginateDto, TrashedDto } from '@/modules/database/types';

@DtoValidation({ type: 'query' })
export class ListQueryDto implements IPaginateDto, TrashedDto {
    @ApiPropertyOptional({
        description:
            '回收站数据过滤,all:包含已软删除和未软删除的数据;only:只包含软删除的数据;none:只包含未软删除的数据',
        enum: QueryTrashMode,
    })
    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;

    @ApiPropertyOptional({
        description: '当前页',
        type: Number,
        minimum: 1,
        default: 1,
    })
    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @ApiPropertyOptional({
        description: '每页最大显示数',
        type: Number,
        minimum: 1,
        default: 10,
    })
    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;
}
