import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';
import { Guest } from '../../decorators';
import { EmailRegisterDto, RegisterEmailCaptchaDto } from '../../dtos';
import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class EmailRegisterController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送用户注册验证码邮件
     * @param data
     */
    @Post('send-email-register-captcha')
    @ApiOperation({ summary: '发送用户注册验证码邮件' })
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
}
