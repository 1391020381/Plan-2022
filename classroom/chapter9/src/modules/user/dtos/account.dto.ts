import { OmitType, PickType } from '@nestjs/swagger';

import { Length } from 'class-validator';

import { IsPassword } from '@/modules/core/constraints';
import { DtoValidation } from '@/modules/core/decorators';

import { UploadFileDto } from '../../media/dtos/upload.dto';
import { CaptchaDtoGroups, UserDtoGroups } from '../constants';

import { GuestDto } from './guest.dto';

/**
 * 对手机/邮箱绑定验证码进行验证
 */
export class AccountBoundDto extends PickType(GuestDto, ['code', 'phone', 'email']) {}

/**
 * 绑定或更改手机号验证
 */
@DtoValidation({ groups: [CaptchaDtoGroups.BOUND_PHONE] })
export class PhoneBoundDto extends OmitType(AccountBoundDto, ['email'] as const) {}

/**
 * 绑定或更改邮箱验证
 */
@DtoValidation({ groups: [CaptchaDtoGroups.BOUND_EMAIL] })
export class EmailBoundDto extends OmitType(AccountBoundDto, ['phone'] as const) {}

/**
 * 更新用户信息
 */
@DtoValidation({ groups: [UserDtoGroups.UPDATE] })
export class UpdateAccountDto extends PickType(GuestDto, ['username', 'nickname']) {}

/**
 * 更改用户密码
 */
export class UpdatePasswordDto extends PickType(GuestDto, ['password', 'plainPassword']) {
    @IsPassword(5, {
        message: '密码必须由小写字母,大写字母,数字以及特殊字符组成',
        always: true,
    })
    @Length(8, 50, {
        message: '密码长度不得少于$constraint1',
        always: true,
    })
    oldPassword!: string;
}

export class UploadAvatarDto extends PickType(UploadFileDto, ['image']) {}
