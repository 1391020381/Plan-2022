import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

import { tNumber } from '@/helpers';
import { PaginateDto } from '@/helpers/types';
import { QueryTrashMode } from '@/modules/core/constants';
import { IsModelExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';
import { TrashedDto } from '@/modules/core/types';
import { UserEntity } from '@/modules/user/entities/user.entity';

import { PermissionEntity } from '../entities';

export class QueryRoleDto implements PaginateDto, TrashedDto {
    @IsModelExist(UserEntity, {
        groups: ['update'],
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    user?: string;

    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;

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

@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateRoleDto {
    @MaxLength(100, {
        always: true,
        message: '名称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '名称必须填写' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @MaxLength(55, {
        always: true,
        message: 'Label长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    label?: string;

    @IsModelExist(PermissionEntity, {
        each: true,
        always: true,
        message: '权限不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '权限ID格式不正确',
    })
    @IsOptional({ always: true })
    permissions?: string[];
}

@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsUUID(undefined, { groups: ['update'], message: 'ID格式错误' })
    @IsDefined({ groups: ['update'], message: 'ID必须指定' })
    id!: string;
}
