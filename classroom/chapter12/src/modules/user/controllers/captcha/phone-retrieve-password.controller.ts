import { Body, Patch, Post, Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';
import { Guest } from '../../decorators';
import { PhoneRetrievePasswordDto, RetrievePasswordPhoneCaptchaDto } from '../../dtos';

import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class PhoneRetrievePasswordController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送找回密码的验证码短信
     * @param data
     */
    @Post('send-phone-retrieve-password-captcha')
    @ApiOperation({ summary: '发送找回密码的验证码短信' })
    @Guest()
    async sendRetrievePasswordPhoneCaptcha(
        @Body()
        data: RetrievePasswordPhoneCaptchaDto,
    ) {
        return this.captchaJob.sendByType({
            data,
            action: CaptchaActionType.RETRIEVEPASSWORD,
            type: CaptchaType.PHONE,
            message: 'can not send phone sms for reset-password!',
        });
    }

    /**
     * 通过短信验证码找回密码
     * @param data
     */
    @Patch('phone-retrieve-password')
    @ApiOperation({ summary: '通过短信验证码找回密码' })
    @Guest()
    async retrievePasswordByPhone(
        @Body()
        data: PhoneRetrievePasswordDto,
    ) {
        return this.authService.retrievePassword({
            ...data,
            value: data.phone,
            type: CaptchaType.PHONE,
        });
    }
}
