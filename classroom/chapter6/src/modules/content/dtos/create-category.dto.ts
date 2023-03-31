import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, MaxLength, ValidateIf } from 'class-validator';

import { tNumber } from '@/helpers';
import { IsModelExist, IsTreeUnique, IsTreeUniqueExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { CategoryEntity } from '../entities';

/**
 * 创建分类数据验证
 */
@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateCategoryDto {
    @IsTreeUnique(
        { entity: CategoryEntity },
        {
            groups: ['create'],
            message: '分类名称重复',
        },
    )
    @IsTreeUniqueExist(
        { entity: CategoryEntity },
        {
            groups: ['update'],
            message: '分类名称重复',
        },
    )
    @MaxLength(25, {
        always: true,
        message: '分类名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '分类名称不得为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @IsModelExist(CategoryEntity, { always: true, message: '父分类不存在' })
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
