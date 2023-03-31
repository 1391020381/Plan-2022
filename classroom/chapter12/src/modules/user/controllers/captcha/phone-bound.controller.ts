import { Body, Patch, Post, SerializeOptions, Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClassToPlain } from '@/modules/core/types';

import { Depends } from '@/modules/restful/decorators';

import { CaptchaActionType, CaptchaType } from '../../constants';
import { ReqUser } from '../../decorators';
import { BoundPhoneCaptchaDto, PhoneBoundDto } from '../../dtos';
import { UserEntity } from '../../entities';

import { CaptchaJob } from '../../queue';
import { AuthService } from '../../services';
import { UserModule } from '../../user.module';

@ApiTags('账户操作')
@Depends(UserModule)
@ApiBearerAuth()
@Controller('account')
export class PhoneBoundController {
    constructor(
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
    ) {}

    /**
     * 发送手机绑定验证码
     * @param data
     */
    @Post('send-phone-bound-captcha')
    @ApiOperation({ summary: '绑定或换绑手机号' })
    async sendBoundPhone(@Body() data: BoundPhoneCaptchaDto) {
        return this.captchaJob.send({
            data,
            action: CaptchaActionType.ACCOUNTBOUND,
            type: CaptchaType.PHONE,
            message: 'can not send phone sms for bind phone',
        });
    }

    /**
     * 绑定或更改手机号
     * @param user
     * @param data
     */
    @ApiOperation({ summary: '重置密码' })
    @Patch('phone-bound')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async boundPhone(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: PhoneBoundDto,
    ): Promise<UserEntity> {
        return this.authService.boundCaptcha(user, {
            ...data,
            type: CaptchaType.PHONE,
            value: data.phone,
        });
    }
}
