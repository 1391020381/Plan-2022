import { Injectable } from '@nestjs/common';
import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, Length } from 'class-validator';

import { QueryTrashMode } from '@/modules/core/constants';
import {
    IsMatch,
    IsMatchPhone,
    IsPassword,
    IsUnique,
    IsUniqueExist,
} from '@/modules/core/constraints';

import { CaptchaDtoGroups, CaptchaType, UserDtoGroups } from '../constants';
import { UserEntity } from '../entities';

/**
 * 用户模块DTO的通用基础字段
 */
@Injectable()
export class GuestDto {
    @Length(4, 50, {
        message: '登录凭证长度必须为$constraint1到$constraint2',
        always: true,
    })
    @IsNotEmpty({ message: '登录凭证不得为空', always: true })
    readonly credential!: string;

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
    @Length(4, 50, {
        always: true,
        message: '用户名长度必须为$constraint1到$constraint2',
    })
    @IsOptional({ groups: [UserDtoGroups.UPDATE] })
    username!: string;

    @Length(3, 20, {
        always: true,
        message: '昵称必须为$constraint1到$constraint2',
    })
    @IsOptional({ always: true })
    nickname?: string;

    @IsUnique(
        { entity: UserEntity },
        {
            message: '手机号已被注册',
            groups: [
                CaptchaDtoGroups.PHONE_REGISTER,
                CaptchaDtoGroups.BOUND_PHONE,
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

    @IsUnique(
        { entity: UserEntity },
        {
            message: '邮箱已被注册',
            groups: [
                CaptchaDtoGroups.EMAIL_REGISTER,
                CaptchaDtoGroups.BOUND_EMAIL,
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

    @IsEnum(QueryTrashMode)
    @IsOptional({ always: true })
    trash?: boolean;

    @IsPassword(5, {
        message: '密码必须由小写字母,大写字母,数字以及特殊字符组成',
        always: true,
    })
    @Length(8, 50, {
        message: '密码长度不得少于$constraint1',
        always: true,
    })
    readonly password!: string;

    @IsMatch('password', { message: '两次输入密码不同', always: true })
    @IsNotEmpty({ message: '请再次输入密码以确认', always: true })
    readonly plainPassword!: string;

    @IsNumberString(undefined, { message: '验证码必须为数字', always: true })
    @Length(6, 6, { message: '验证码长度错误', always: true })
    readonly code!: string;

    @IsEnum(CaptchaType)
    type: CaptchaType;
}
