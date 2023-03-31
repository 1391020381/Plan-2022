import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClassToPlain } from '@/modules/core/types';
import { Depends } from '@/modules/restful/decorators';

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

import { UserModule } from '../user.module';

import { AuthCaptchaController } from './captcha.controller';

/**
 * Auth操作控制器
 */

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class AuthController extends AuthCaptchaController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {
        super(captchaJob);
    }

    @Post('login')
    @ApiOperation({ summary: '用户通过凭证(可以是用户名,邮箱,手机号等)+密码登录' })
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
    @ApiOperation({ summary: '用户通过手机号+验证码' })
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
    @ApiOperation({ summary: '用户通过邮箱+验证码' })
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
    @ApiOperation({ summary: '用户登出账户' })
    @ApiBearerAuth()
    async logout(@Request() req: any) {
        return this.authService.logout(req);
    }

    /**
     * 使用用户名密码注册
     * @param data
     */
    @Post('register')
    @ApiOperation({ summary: '通过用户名+密码注册账户' })
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
    @ApiOperation({ summary: '通过手机号+验证码注册账户' })
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
    @ApiOperation({ summary: '用户通过邮箱+验证码' })
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
    @ApiOperation({ summary: '通过对凭证绑定的手机号和邮箱同时发送验证码来找回密码' })
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
    @ApiOperation({ summary: '通过短信验证码找回密码' })
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
    @ApiOperation({ summary: '通过邮件验证码找回密码' })
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
