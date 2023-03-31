import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { IsNumber, IsOptional, Min, IsBoolean, IsEnum, IsUUID, MaxLength } from 'class-validator';

import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';
import { toBoolean } from '@/modules/core/helpers';
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
    @ApiPropertyOptional({
        description: '搜索关键字:文章全文搜索字符串',
        maxLength: 100,
    })
    @MaxLength(100, {
        always: true,
        message: '搜索字符串长度不得超过$constraint1',
    })
    @IsOptional({ always: true })
    search?: string;

    @ApiPropertyOptional({
        description: '分类ID:过滤一个分类及其子孙分类下的文章',
    })
    @IsModelExist(CategoryEntity, {
        message: '指定的分类不存在',
    })
    @IsUUID(undefined, { message: '分类ID格式错误' })
    @IsOptional()
    category?: string;

    @ApiPropertyOptional({
        description: '用户ID:根据文章作者过滤文章',
    })
    @IsModelExist(UserEntity, {
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    author?: string;

    @ApiPropertyOptional({
        description: '发布状态:根据是否发布过滤文章状态',
    })
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @ApiPropertyOptional({
        description: '排序规则:可指定文章列表的排序规则,默认为综合排序',
        enum: PostOrderType,
    })
    @IsEnum(PostOrderType, {
        message: `排序规则必须是${Object.values(PostOrderType).join(',')}其中一项`,
    })
    @IsOptional()
    orderBy?: PostOrderType;
}

@DtoValidation({ groups: ['create'] })
export class CreatePostDto extends OmitType(ManageCreatePostDto, ['author', 'customOrder']) {
    @ApiPropertyOptional({
        description: '用户侧排序:文章在用户的文章管理而非后台中,列表的排序规则',
        type: Number,
        minimum: 0,
        default: 0,
    })
    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    userOrder = 0;
}

export class CreatePostWithOutTypeDto extends OmitType(CreatePostDto, ['type']) {}

@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends OmitType(ManageUpdatePostDto, ['author', 'customOrder']) {
    @ApiPropertyOptional({
        description: '用户侧排序:文章在用户的文章管理而非后台中,列表的排序规则',
        type: Number,
        minimum: 0,
        default: 0,
    })
    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    userOrder = 0;
}

export class UpdatePostWithOutTypeDto extends OmitType(UpdatePostDto, ['type']) {}
