import { OmitType } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { IsNumber, IsOptional, Min, IsBoolean, IsEnum, IsUUID, MaxLength } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { tBoolean, tNumber } from '@/modules/core/helpers';
import { IsModelExist } from '@/modules/database/constraints';
import { ListQueryDto } from '@/modules/restful/dtos';

import { UserEntity } from '@/modules/user/entities';

import { PostOrderType } from '../constants';
import { CategoryEntity } from '../entities';

import { ManageCreatePostDto, ManageUpdatePostDto } from './manage';

/**
 * 分页文章列表查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryPostDto extends ListQueryDto {
    @MaxLength(100, {
        always: true,
        message: '搜索字符串长度不得超过$constraint1',
    })
    @IsOptional({ always: true })
    search?: string;

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

    @IsEnum(PostOrderType, {
        message: `排序规则必须是${Object.values(PostOrderType).join(',')}其中一项`,
    })
    @IsOptional()
    orderBy?: PostOrderType;
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
