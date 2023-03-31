import { OmitType, PickType } from '@nestjs/swagger';
import { Length } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

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
export class UpdatePassword extends PickType(GuestDto, ['password', 'plainPassword']) {
    @Length(8, 50, {
        message: '密码长度至少为$constraint1个字符',
    })
    oldPassword!: string;
}
