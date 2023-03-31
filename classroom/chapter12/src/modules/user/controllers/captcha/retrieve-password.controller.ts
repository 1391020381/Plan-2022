import { Body, Patch, Post, Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType } from '../../constants';

import { Guest } from '../../decorators';
import { CredentialCaptchaMessageDto, RetrievePasswordDto } from '../../dtos';

import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class RetrievePasswordController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 通过登录凭证找回密码时同时发送短信和邮件
     * @param param0
     */
    @Post('send-retrieve-password-captcha')
    @ApiOperation({ summary: '通过登录凭证找回密码时同时发送短信和邮件' })
    @Guest()
    async sendRetrievePasswordCaptcha(
        @Body()
        { credential }: CredentialCaptchaMessageDto,
    ) {
        return this.captchaJob.sendByCredential({
            credential,
            action: CaptchaActionType.RETRIEVEPASSWORD,
            message: 'can not send phone sms or email for reset-password!',
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
}
