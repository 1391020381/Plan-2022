import { Body, Post } from '@nestjs/common';

import { CaptchaActionType, CaptchaType } from '../constants';
import { Guest } from '../decorators';
import {
    CredentialCaptchaMessageDto,
    LoginEmailCaptchaDto,
    LoginPhoneCaptchaDto,
    RegisterEmailCaptchaDto,
    RegisterPhoneCaptchaDto,
    RetrievePasswordEmailCaptchaDto,
    RetrievePasswordPhoneCaptchaDto,
} from '../dtos';
import { CaptchaJob } from '../queue';

/**
 * 发送用户验证码控制器
 */
export abstract class AuthCaptchaController {
    constructor(protected readonly captchaJob: CaptchaJob) {}

    /**
     * 发送登录验证码短信
     * @param data
     */
    @Post('send-login-sms')
    @Guest()
    async sendLoginSms(
        @Body()
        data: LoginPhoneCaptchaDto,
    ) {
        return this.captchaJob.sendByCredential({
            ...data,
            credential: data.phone,
            action: CaptchaActionType.LOGIN,
            type: CaptchaType.SMS,
        });
    }

    /**
     * 发送登录验证码邮件
     * @param data
     */
    @Post('send-login-email')
    @Guest()
    async sendLoginEmail(
        @Body()
        data: LoginEmailCaptchaDto,
    ) {
        return this.captchaJob.sendByCredential({
            ...data,
            credential: data.email,
            action: CaptchaActionType.LOGIN,
            type: CaptchaType.EMAIL,
        });
    }

    /**
     * 发送用户注册验证码短信
     * @param data
     */
    @Post('send-register-sms')
    @Guest()
    async sendRegisterSms(
        @Body()
        data: RegisterPhoneCaptchaDto,
    ) {
        const { result } = await this.captchaJob.send({
            data,
            action: CaptchaActionType.REGISTER,
            type: CaptchaType.SMS,
            message: 'can not send sms for register user!',
        });
        return { result };
    }

    /**
     * 发送用户注册验证码邮件
     * @param data
     */
    @Post('send-register-email')
    @Guest()
    async sendRegisterEmail(
        @Body()
        data: RegisterEmailCaptchaDto,
    ) {
        const { result } = await this.captchaJob.send({
            data,
            action: CaptchaActionType.REGISTER,
            type: CaptchaType.EMAIL,
            message: 'can not send email for register user!',
        });
        return { result };
    }

    /**
     * 发送找回密码的验证码短信
     * @param data
     */
    @Post('send-retrieve-password-sms')
    @Guest()
    async sendRetrievePasswordSms(
        @Body()
        data: RetrievePasswordPhoneCaptchaDto,
    ) {
        return this.captchaJob.sendByType({
            data,
            action: CaptchaActionType.RETRIEVEPASSWORD,
            type: CaptchaType.SMS,
            message: 'can not send sms for reset-password!',
        });
    }

    /**
     * 发送找回密码的验证码邮件
     * @param data
     */
    @Post('send-retrieve-password-email')
    @Guest()
    async sendRetrievePasswordEmail(
        @Body()
        data: RetrievePasswordEmailCaptchaDto,
    ) {
        return this.captchaJob.sendByType({
            data,
            action: CaptchaActionType.RETRIEVEPASSWORD,
            type: CaptchaType.EMAIL,
            message: 'can not send email for reset-password!',
        });
    }

    /**
     * 通过登录凭证找回密码时同时发送短信和邮件
     * @param param0
     */
    @Post('send-retrieve-password')
    @Guest()
    async sendRetrievePasswordCaptcha(
        @Body()
        { credential }: CredentialCaptchaMessageDto,
    ) {
        return this.captchaJob.sendByCredential({
            credential,
            action: CaptchaActionType.RETRIEVEPASSWORD,
            message: 'can not send sms or email for reset-password!',
        });
    }
}
