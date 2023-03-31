import { OmitType } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min, IsBoolean, IsEnum, IsUUID } from 'class-validator';

import { tNumber, tBoolean } from '@/helpers';

import { PaginateDto } from '@/helpers/types';
import { QueryTrashMode } from '@/modules/core/constants';
import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { TrashedDto } from '@/modules/core/types';

import { UserEntity } from '@/modules/user/entities';

import { PostOrderType } from '../constants';
import { CategoryEntity } from '../entities';

import { ManageCreatePostDto, ManageUpdatePostDto } from './manage';

/**
 * 分页文章列表查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryPostDto implements PaginateDto, TrashedDto {
    @IsModelExist(CategoryEntity, {
        message: '指定的分类不存在',
    })
    @IsUUID(undefined, { message: '分类ID格式错误' })
    @IsOptional()
    category?: string;

    @IsModelExist(UserEntity, {
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    author?: string;

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

@DtoValidation({ groups: ['create'] })
export class CreatePostDto extends OmitType(ManageCreatePostDto, ['author', 'customOrder']) {
    @Transform(({ value }) => tNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    userOrder = 0;
}

@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends OmitType(ManageUpdatePostDto, ['author', 'customOrder']) {
    @Transform(({ value }) => tNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    userOrder = 0;
}
