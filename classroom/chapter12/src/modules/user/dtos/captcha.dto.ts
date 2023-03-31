import { PickType } from '@nestjs/swagger';

import { DtoValidation } from '@/modules/core/decorators';

import { CaptchaDtoGroups } from '../constants';

import { GuestDto } from './guest.dto';

/**
 * 发送邮件或短信验证码消息
 */
export class CaptchaMessage extends PickType(GuestDto, ['phone', 'email']) {}

/**
 * 发送短信验证码DTO类型
 */
export class PhoneCaptchaMessageDto extends PickType(CaptchaMessage, ['phone'] as const) {}

/**
 * 发送邮件验证码DTO类型
 */
export class EmailCaptchaMessageDto extends PickType(CaptchaMessage, ['email'] as const) {}

/**
 * 通过已登录账户发送验证码消息
 */
export class UserCaptchaMessageDto extends PickType(GuestDto, ['type']) {}

/**
 * 通过用户凭证发送验证码消息
 */
export class CredentialCaptchaMessageDto extends PickType(GuestDto, ['credential']) {}

/**
 * 发送登录验证码短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_LOGIN] })
export class LoginPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送登录验证码邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_LOGIN] })
export class LoginEmailCaptchaDto extends EmailCaptchaMessageDto {}

/**
 * 发送注册验证码短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_REGISTER] })
export class RegisterPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送注册验证码邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_REGISTER] })
export class RegisterEmailCaptchaDto extends EmailCaptchaMessageDto {}

/**
 * 发送找回密码短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_RETRIEVE_PASSWORD] })
export class RetrievePasswordPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送找回密码邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_RETRIEVE_PASSWORD] })
export class RetrievePasswordEmailCaptchaDto extends EmailCaptchaMessageDto {}

/**
 * 发送手机绑定短信
 */
@DtoValidation({ groups: [CaptchaDtoGroups.PHONE_BOUND] })
export class BoundPhoneCaptchaDto extends PhoneCaptchaMessageDto {}

/**
 * 发送邮箱绑定邮件
 */
@DtoValidation({ groups: [CaptchaDtoGroups.EMAIL_BOUND] })
export class BoundEmailCaptchaDto extends EmailCaptchaMessageDto {}
