import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { IsModelExist } from '@/modules/database/constraints';
import { ListQueryDto } from '@/modules/restful/dtos';

import { UserEntity } from '@/modules/user/entities';

import { PermissionEntity } from '../entities/permission.entity';

export class QueryRoleDto extends ListQueryDto {
    @IsModelExist(UserEntity, {
        groups: ['update'],
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    user?: string;
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

    @MaxLength(100, {
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
