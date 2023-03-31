import { Body, Patch, Post, Controller } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';
import { Guest } from '../../decorators';
import { EmailRetrievePasswordDto, RetrievePasswordEmailCaptchaDto } from '../../dtos';

import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class EmailRetrievePasswordController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送找回密码的验证码邮件
     * @param data
     */
    @Post('send-email-retrieve-password-captcha')
    @ApiOperation({ summary: '发送找回密码的验证码邮件' })
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
     * 通过邮件验证码找回密码
     * @param data
     */
    @Patch('email-retrieve-password')
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
