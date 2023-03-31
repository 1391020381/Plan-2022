import { Body, Controller, Patch, Post, SerializeOptions } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClassToPlain } from '@/modules/core/types';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';
import { ReqUser } from '../../decorators';
import { BoundEmailCaptchaDto, EmailBoundDto } from '../../dtos';
import { UserEntity } from '../../entities';

import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('账户操作')
@Depends(UserModule)
@ApiBearerAuth()
@Controller('account')
export class EmailBoundController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送邮件绑定验证码
     * @param data
     */
    @ApiOperation({ summary: '绑定或换绑邮箱' })
    @Post('send-email-bound')
    async sendEmailBound(@Body() data: BoundEmailCaptchaDto) {
        return this.captchaJob.send({
            data,
            action: CaptchaActionType.ACCOUNTBOUND,
            type: CaptchaType.EMAIL,
            message: 'can not send email for bind',
        });
    }

    /**
     * 绑定或更改邮箱
     * @param user
     * @param data
     */
    @Patch('email-bound')
    @ApiOperation({ summary: '绑定或换绑邮箱' })
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async boundEmail(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: EmailBoundDto,
    ): Promise<UserEntity> {
        return this.authService.boundCaptcha(user, {
            ...data,
            type: CaptchaType.EMAIL,
            value: data.email,
        });
    }
}
