import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

import { QueryTrashMode } from '@/modules/core/constants';
import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';
import { tBoolean, tNumber } from '@/modules/core/helpers';
import { PaginateDto } from '@/modules/core/types';

import { TrashedDto } from '../../core/types';
import { PostOrderType } from '../constants';
import { CategoryEntity } from '../entities';

/**
 * 分页文章列表查询验证
 */
@Injectable()
@DtoValidation({ type: 'query' })
export class QueryPostDto implements PaginateDto, TrashedDto {
    @IsModelExist(CategoryEntity, {
        groups: ['update'],
        message: '指定的分类不存在',
    })
    @IsUUID(undefined, { message: '分类ID格式错误' })
    @IsOptional()
    category?: string;

    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;

    @IsEnum(PostOrderType, {
        message: `排序规则必须是${Object.values(PostOrderType).join(',')}其中一项`,
    })
    @IsOptional()
    orderBy?: PostOrderType;

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
}
