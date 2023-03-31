import { Injectable } from '@nestjs/common';
import { PickType, PartialType, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { toBoolean } from '@/modules/core/helpers';
import { IsModelExist } from '@/modules/database/constraints';
import { PermissionEntity, RoleEntity } from '@/modules/rbac/entities';

import { ListQueryDto } from '@/modules/restful/dtos';

import { UserDtoGroups, UserOrderType } from '../constants';

import { UserEntity } from '../entities';

import { GuestDto } from './guest.dto';

/**
 * 创建用的请求数据验证
 */
@DtoValidation({ groups: [UserDtoGroups.CREATE] })
export class CreateUserDto extends PickType(GuestDto, [
    'username',
    'nickname',
    'password',
    'phone',
    'email',
]) {
    @ApiPropertyOptional({
        description: '用户激活状态(无法禁用第一个超级管理员用户)',
    })
    @IsBoolean({ always: true, message: 'actived必须为布尔值' })
    @IsOptional({ always: true })
    actived?: boolean;

    @ApiPropertyOptional({
        description: '用户关联的角色ID列表',
        type: [String],
    })
    @IsModelExist(RoleEntity, {
        each: true,
        always: true,
        message: '角色不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: '角色ID格式不正确',
    })
    @IsOptional({ always: true })
    roles?: string[];

    @ApiPropertyOptional({
        description: '用户直接关联的权限ID列表',
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

/**
 * 更新用户
 */
@DtoValidation({ groups: [UserDtoGroups.UPDATE] })
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: '待更新的用户ID',
    })
    @IsModelExist(UserEntity, {
        groups: ['update'],
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { groups: [UserDtoGroups.UPDATE], message: '用户ID格式不正确' })
    id!: string;
}

/**
 * 查询用户列表的Query数据验证
 */
@Injectable()
@DtoValidation({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryUserDto extends ListQueryDto {
    @ApiPropertyOptional({
        description: '角色ID:根据角色来过滤用户',
    })
    @IsModelExist(RoleEntity, {
        message: '角色不存在',
    })
    @IsUUID(undefined, { message: '角色ID格式错误' })
    @IsOptional()
    role?: string;

    @ApiPropertyOptional({
        description:
            '权限ID:根据权限来过滤用户(权限包含用户关联的所有角色的权限以及直接关联的权限)',
    })
    @IsModelExist(PermissionEntity, {
        message: '权限不存在',
    })
    @IsUUID(undefined, { message: '权限ID格式错误' })
    @IsOptional()
    permission?: string;

    @ApiPropertyOptional({
        description: '根据是否激活来过滤用户',
    })
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    actived?: boolean;

    @ApiPropertyOptional({
        description: '排序规则:可指定用户列表的排序规则,默认为按创建时间降序排序',
        enum: UserOrderType,
    })
    @IsEnum(UserOrderType)
    orderBy?: UserOrderType;
}
