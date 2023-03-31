import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';

import { ClassToPlain } from '@/modules/core/types';

import { CaptchaType } from '../constants';
import { Guest, ReqUser } from '../decorators';

import {
    CredentialDto,
    EmailLoginDto,
    EmailRegisterDto,
    EmailRetrievePasswordDto,
    PhoneLoginDto,
    PhoneRegisterDto,
    PhoneRetrievePasswordDto,
    RegisterDto,
    RetrievePasswordDto,
} from '../dtos';
import { UserEntity } from '../entities';
import { LocalAuthGuard } from '../guards';
import { CaptchaJob } from '../queue';
import { AuthService } from '../services';

import { AuthCaptchaController } from './captcha.controller';

/**
 * Auth操作控制器
 */
@Controller('auth')
export class AuthController extends AuthCaptchaController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {
        super(captchaJob);
    }

    @Post('login')
    @Guest()
    @UseGuards(LocalAuthGuard)
    async login(@ReqUser() user: ClassToPlain<UserEntity>, @Body() _data: CredentialDto) {
        return { token: await this.authService.createToken(user.id) };
    }

    /**
     * 通过短信验证码登录
     * @param param0
     */
    @Post('phone-login')
    @Guest()
    async loginByPhone(@Body() { phone, code }: PhoneLoginDto) {
        const user = await this.authService.loginByCaptcha(phone, code, CaptchaType.SMS);
        return { token: await this.authService.createToken(user.id) };
    }

    /**
     * 通过邮件验证码登录
     * @param param0
     */
    @Post('email-login')
    @Guest()
    async loginByEmail(@Body() { email, code }: EmailLoginDto) {
        const user = await this.authService.loginByCaptcha(email, code, CaptchaType.EMAIL);
        return { token: await this.authService.createToken(user.id) };
    }

    /**
     * 注销登录
     * @param req
     */
    @Post('logout')
    async logout(@Request() req: any) {
        return this.authService.logout(req);
    }

    /**
     * 使用用户名密码注册
     * @param data
     */
    @Post('register')
    @Guest()
    async register(
        @Body()
        data: RegisterDto,
    ) {
        return this.authService.register(data);
    }

    /**
     * 通过手机号验证注册用户
     * @param data
     */
    @Post('phone-register')
    @Guest()
    async registerByPhone(
        @Body()
        data: PhoneRegisterDto,
    ) {
        return this.authService.registerByCaptcha({
            ...data,
            value: data.phone,
            type: CaptchaType.SMS,
        });
    }

    /**
     * 通过邮箱验证注册用户
     * @param data
     */
    @Post('email-register')
    @Guest()
    async registerByEmail(
        @Body()
        data: EmailRegisterDto,
    ) {
        return this.authService.registerByCaptcha({
            ...data,
            value: data.email,
            type: CaptchaType.EMAIL,
        });
    }

    /**
     * 通过用户凭证(用户名,短信,邮件)发送邮件和短信验证码后找回密码
     * @param data
     */
    @Patch('retrieve-password')
    @Guest()
    async retrievePassword(
        @Body()
        data: RetrievePasswordDto,
    ) {
        return this.authService.retrievePassword({
            ...data,
            value: data.credential,
        });
    }

    /**
     * 通过短信验证码找回密码
     * @param data
     */
    @Patch('retrieve-password-sms')
    @Guest()
    async retrievePasswordByPhone(
        @Body()
        data: PhoneRetrievePasswordDto,
    ) {
        return this.authService.retrievePassword({
            ...data,
            value: data.phone,
            type: CaptchaType.SMS,
        });
    }

    /**
     * 通过邮件验证码找回密码
     * @param data
     */
    @Patch('retrieve-password-email')
    @Guest()
    async retrievePasswordByEmail(
        @Body()
        data: EmailRetrievePasswordDto,
    ) {
        return this.authService.retrievePassword({
            ...data,
            value: data.email,
            type: CaptchaType.EMAIL,
        });
    }
}
