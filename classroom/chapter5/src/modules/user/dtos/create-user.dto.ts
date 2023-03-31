import { Injectable } from '@nestjs/common';
import { IsEmail, IsOptional, Length } from 'class-validator';

import { IsPassword, IsUnique, IsUniqueExist } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { UserEntity } from '../entities';

/**
 * 创建用户验证
 */
@Injectable()
@DtoValidation({ groups: ['create'] })
export class CreateUserDto {
    @Length(5, 50, { always: true })
    @IsUnique(
        { entity: UserEntity },
        {
            groups: ['create'],
            message: '该用户名已被注册',
        },
    )
    @IsUniqueExist(
        { entity: UserEntity, ignore: 'id' },
        {
            groups: ['update'],
            message: '该用户名已被其他用户注册',
        },
    )
    @IsOptional({ groups: ['update'] })
    username!: string;

    @IsPassword(5, {
        message: '密码必须由小写字母,大写字母,数字以及特殊字符组成',
        always: true,
    })
    @Length(8, 50, {
        always: true,
        message: '密码长度不得少于$constraint1',
    })
    @IsOptional({ groups: ['update'] })
    password!: string;

    @Length(3, 20, {
        always: true,
        message: '昵称必须为$constraint1到$constraint2',
    })
    @IsOptional({ always: true })
    nickname?: string;

    @IsUnique(
        { entity: UserEntity },
        {
            message: '邮箱已被注册',
            groups: ['create'],
        },
    )
    @IsUniqueExist(
        { entity: UserEntity, ignore: 'id' },
        {
            groups: ['update'],
            message: '此邮箱已被注册',
        },
    )
    @IsEmail(undefined, { always: true, message: '邮箱格式错误' })
    @IsOptional({ always: true })
    email?: string;
}
