import { Body, Post, Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';

import { Guest } from '../../decorators';
import { PhoneRegisterDto, RegisterPhoneCaptchaDto } from '../../dtos';

import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class PhoneRegisterController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送用户注册验证码短信
     * @param data
     */
    @Post('send-phone-register-captcha')
    @ApiOperation({ summary: '发送用户注册验证码短信' })
    @Guest()
    async sendRegisterPhoneCaptcha(
        @Body()
        data: RegisterPhoneCaptchaDto,
    ) {
        const { result } = await this.captchaJob.send({
            data,
            action: CaptchaActionType.REGISTER,
            type: CaptchaType.PHONE,
            message: 'can not send phone sms for register user!',
        });
        return { result };
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
            type: CaptchaType.PHONE,
        });
    }
}
