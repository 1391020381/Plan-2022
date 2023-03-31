import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';
import { Guest } from '../../decorators';
import { EmailLoginDto, LoginEmailCaptchaDto } from '../../dtos';
import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class EmailLoginController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送登录验证码邮件
     * @param data
     */
    @Post('send-email-login-captcha')
    @ApiOperation({ summary: '发送登录验证码邮件' })
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
}
