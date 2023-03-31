import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { tNumber } from '@/modules/core/helpers';
import { PaginateDto } from '@/modules/core/types';

/**
 * 分类列表分页查询验证
 */
@Injectable()
@DtoValidation({ type: 'query' })
export class QueryCategoryDto implements PaginateDto {
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
}

/**
 * 创建分类数据验证
 */
@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateCategoryDto {
    @MaxLength(25, {
        always: true,
        message: '分类名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '分类名称不得为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @IsUUID(undefined, { always: true, message: '父分类ID格式不正确' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;

    @Transform(({ value }) => tNumber(value))
    @IsNumber(undefined, { message: '排序必须为整数' })
    @IsOptional({ always: true })
    customOrder?: number;
}

/**
 * 分类更新验证
 */
@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
    @IsDefined({ groups: ['update'], message: '分类ID必须指定' })
    id!: string;
}
