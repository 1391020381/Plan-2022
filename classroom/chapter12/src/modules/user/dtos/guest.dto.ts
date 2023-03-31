import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDefined,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    Length,
} from 'class-validator';

import { IsMatch, IsMatchPhone, IsPassword } from '@/modules/core/constraints';
import { IsUnique, IsUniqueExist } from '@/modules/database/constraints';

import { QueryTrashMode } from '../../database/constants';
import { CaptchaDtoGroups, CaptchaType, UserDtoGroups } from '../constants';
import { UserEntity } from '../entities/user.entity';

/**
 * 用户模块DTO的通用基础字段
 */
@Injectable()
export class GuestDto {
    @ApiProperty({
        description: '登录凭证:可以是用户名,手机号,邮箱地址',
        minLength: 4,
        maxLength: 20,
    })
    @Length(4, 30, {
        message: '登录凭证长度必须为$constraint1到$constraint2',
        always: true,
    })
    @IsNotEmpty({ message: '登录凭证不得为空', always: true })
    readonly credential!: string;

    @ApiProperty({
        description: '用户名',
        minLength: 4,
        maxLength: 30,
        uniqueItems: true,
    })
    @IsUnique(
        { entity: UserEntity },
        {
            groups: [UserDtoGroups.REGISTER, UserDtoGroups.CREATE],
            message: '该用户名已被注册',
        },
    )
    @IsUniqueExist(
        { entity: UserEntity, ignore: 'id' },
        {
            groups: [UserDtoGroups.UPDATE, UserDtoGroups.BOUND],
            message: '该用户名已被注册',
        },
    )
    @Length(4, 30, {
        always: true,
        message: '用户名长度必须为$constraint1到$constraint2',
    })
    @IsOptional({ groups: [UserDtoGroups.UPDATE] })
    username!: string;

    @ApiPropertyOptional({
        description: '昵称:不设置则为用户名',
    })
    @Length(3, 20, {
        always: true,
        message: '昵称必须为$constraint1到$constraint2',
    })
    @IsOptional({ always: true })
    nickname?: string;

    @ApiProperty({
        description: '手机号:必须是区域开头的,比如+86.15005255555',
        uniqueItems: true,
    })
    @IsUnique(
        { entity: UserEntity },
        {
            message: '手机号已被注册',
            groups: [
                CaptchaDtoGroups.PHONE_REGISTER,
                CaptchaDtoGroups.PHONE_BOUND,
                UserDtoGroups.CREATE,
            ],
        },
    )
    @IsMatchPhone(
        undefined,
        { strictMode: true },
        {
            message: '手机格式错误,示例: +86.15005255555',
            always: true,
        },
    )
    @IsOptional({ groups: [UserDtoGroups.CREATE, UserDtoGroups.UPDATE] })
    phone: string;

    @ApiProperty({
        description: '邮箱地址:必须符合邮箱地址规则',
        uniqueItems: true,
    })
    @IsUnique(
        { entity: UserEntity },
        {
            message: '邮箱已被注册',
            groups: [
                CaptchaDtoGroups.EMAIL_REGISTER,
                CaptchaDtoGroups.EMAIL_BOUND,
                UserDtoGroups.CREATE,
            ],
        },
    )
    @IsEmail(undefined, {
        message: '邮箱地址格式错误',
        always: true,
    })
    @IsOptional({ groups: [UserDtoGroups.CREATE, UserDtoGroups.UPDATE] })
    email: string;

    @ApiProperty({
        description: '用户密码:密码必须由小写字母,大写字母,数字以及特殊字符组成',
        minLength: 8,
        maxLength: 50,
    })
    @IsPassword(5, {
        message: '密码必须由小写字母,大写字母,数字以及特殊字符组成',
        always: true,
    })
    @Length(8, 50, {
        message: '密码长度不得少于$constraint1',
        always: true,
    })
    @IsOptional({ groups: [UserDtoGroups.UPDATE] })
    readonly password!: string;

    @ApiProperty({
        description: '确认密码:必须与用户密码输入相同的字符串',
        minLength: 8,
        maxLength: 50,
    })
    @IsMatch('password', { message: '两次输入密码不同', always: true })
    @IsNotEmpty({ message: '请再次输入密码以确认', always: true })
    readonly plainPassword!: string;

    @ApiPropertyOptional({
        description:
            '回收站数据过滤,all为包含已软删除和未软删除的数据;only为只包含软删除的数据;none为只包含未软删除的数据',
        enum: QueryTrashMode,
    })
    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;

    @ApiProperty({
        description:
            '验证码:用户通过手机或邮箱发送的验证码,用于注册,登录,找回密码及换绑手机/邮箱等操作',
        minLength: 6,
        maxLength: 6,
    })
    @IsNumberString(undefined, { message: '验证码必须为数字', always: true })
    @Length(6, 6, { message: '验证码长度错误', always: true })
    @IsDefined({ message: '验证码必须填写', always: true })
    readonly code!: string;

    @ApiProperty({
        description: '发送验证码或验证验证码的类型:sms为手机号,email为邮箱地址',
        enum: CaptchaType,
    })
    @IsEnum(CaptchaType)
    type: CaptchaType;
}
