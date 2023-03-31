import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';
import { IsModelExist, IsTreeUnique, IsTreeUniqueExist } from '@/modules/database/constraints';

import { CategoryEntity } from '../../entities';

/**
 * 创建分类数据验证
 */
@DtoValidation({ groups: ['create'] })
export class ManageCreateCategoryDto {
    @ApiProperty({
        description: '分类名称:同一个父分类下的同级别子分类名称具有唯一性',
        uniqueItems: true,
        maxLength: 25,
    })
    @IsTreeUnique(CategoryEntity, {
        groups: ['create'],
        message: '分类名称重复',
    })
    @IsTreeUniqueExist(CategoryEntity, {
        groups: ['update'],
        message: '分类名称重复',
    })
    @MaxLength(25, {
        always: true,
        message: '分类名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '分类名称不得为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @ApiProperty({
        description: '父分类ID',
    })
    @IsModelExist(CategoryEntity, { always: true, message: '父分类不存在' })
    @IsUUID(undefined, { always: true, message: '父分类ID格式不正确' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;

    @ApiProperty({
        description: '自定义排序:该排序仅生效于同一父分类的同级别下的子分类(包括顶级分类)',
        type: Number,
        minimum: 0,
        default: 0,
    })
    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    customOrder = 0;
}
