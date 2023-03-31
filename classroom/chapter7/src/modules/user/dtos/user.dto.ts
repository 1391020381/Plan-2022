import { Injectable } from '@nestjs/common';
import { PickType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

import { tBoolean, tNumber } from '@/helpers';
import { QueryTrashMode } from '@/modules/core/constants';
import { DtoValidation } from '@/modules/core/decorators';

import { UserDtoGroups, UserOrderType } from '../constants';

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
    @IsBoolean({ always: true, message: 'actived必须为布尔值' })
    @IsOptional({ always: true })
    actived?: boolean;
}

/**
 * 更新用户
 */
@DtoValidation({ groups: [UserDtoGroups.UPDATE] })
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsUUID(undefined, { groups: [UserDtoGroups.UPDATE], message: '用户ID格式不正确' })
    id!: string;
}

/**
 * 查询用户列表的Query数据验证
 *
 * @export
 * @class QueryUserDto
 */
@Injectable()
@DtoValidation({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryUserDto {
    /**
     * 过滤激活状态
     */
    @Transform(({ value }) => tBoolean(value))
    @IsBoolean()
    actived?: boolean;

    @IsEnum(UserOrderType)
    orderBy?: UserOrderType;

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
