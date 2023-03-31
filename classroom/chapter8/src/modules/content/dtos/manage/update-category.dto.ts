import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { CategoryEntity } from '../../entities';

import { ManageCreateCategoryDto } from './create-category.dto';

/**
 * 分类更新验证
 */
@DtoValidation({ groups: ['update'] })
export class ManageUpdateCategoryDto extends PartialType(ManageCreateCategoryDto) {
    @IsModelExist(CategoryEntity, {
        groups: ['update'],
        message: '指定的分类不存在',
    })
    @IsUUID(undefined, { groups: ['update'], message: '分类ID格式错误' })
    @IsDefined({ groups: ['update'], message: '分类ID必须指定' })
    id!: string;
}
