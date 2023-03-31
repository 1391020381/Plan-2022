import { Body, Post, Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';
import { Guest } from '../../decorators';
import { LoginPhoneCaptchaDto, PhoneLoginDto } from '../../dtos';

import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class PhoneLoginController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送登录验证码短信
     * @param data
     */
    @Post('send-phone-login-captcha')
    @ApiOperation({ summary: '发送登录验证码短信' })
    @Guest()
    async sendPhoneLoginCaptcha(
        @Body()
        data: LoginPhoneCaptchaDto,
    ) {
        return this.captchaJob.sendByCredential({
            ...data,
            credential: data.phone,
            action: CaptchaActionType.LOGIN,
            type: CaptchaType.PHONE,
        });
    }

    /**
     * 通过短信验证码登录
     * @param param0
     */
    @Post('phone-login')
    @ApiOperation({ summary: '用户通过手机号+验证码' })
    @Guest()
    async loginByPhone(@Body() data: PhoneLoginDto) {
        const { phone, code } = data;
        const user = await this.authService.loginByCaptcha(phone, code, CaptchaType.PHONE);
        return { token: await this.authService.createToken(user.id) };
    }
}
