import { Injectable } from '@nestjs/common';
import { IsNotEmpty, Length } from 'class-validator';

import { IsPassword } from '@/modules/core/constraints';

/**
 * 用户登录验证
 */
@Injectable()
export class CredentialDto {
    @IsNotEmpty({ message: '登录凭证不得为空' })
    readonly credential!: string;

    @IsPassword(5, {
        message: '密码必须由小写字母,大写字母,数字以及特殊字符组成',
        always: true,
    })
    @Length(8, 50, {
        always: true,
        message: '密码长度不得少于$constraint1',
    })
    @IsNotEmpty({ message: '密码必须填写' })
    readonly password!: string;
}
