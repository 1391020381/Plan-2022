import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { IsModelExist } from '@/modules/database/constraints';
import { ListQueryDto } from '@/modules/restful/dtos';

import { UserEntity } from '@/modules/user/entities';

import { PermissionEntity } from '../entities/permission.entity';

export class QueryRoleDto extends ListQueryDto {
    @ApiPropertyOptional({
        description: '用户ID:通过用户过滤角色列表',
    })
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
    @ApiProperty({
        description: '权限名称',
        maxLength: 100,
    })
    @MaxLength(100, {
        always: true,
        message: '名称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '名称必须填写' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @ApiPropertyOptional({
        description: '权限标识:如果没有设置则在查询后为权限名称',
        maximum: 100,
    })
    @MaxLength(100, {
        always: true,
        message: 'Label长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    label?: string;

    @ApiPropertyOptional({
        description: '关联权限ID列表:一个角色可以关联多个权限,一个权限也可以属于多个角色',
        type: [String],
    })
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
    @ApiProperty({
        description: '待更新的角色ID',
    })
    @IsUUID(undefined, { groups: ['update'], message: 'ID格式错误' })
    @IsDefined({ groups: ['update'], message: 'ID必须指定' })
    id!: string;
}
