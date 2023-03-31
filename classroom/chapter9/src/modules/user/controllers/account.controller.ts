import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Res,
    SerializeOptions,
    StreamableFile,
} from '@nestjs/common';

import { FastifyReply } from 'fastify';
import { createReadStream, existsSync } from 'fs-extra';
import { isNil, pick } from 'lodash';

import { lookup } from 'mime-types';

import { OptionalUUIDPipe } from '@/modules/core/pipes';
import { ClassToPlain } from '@/modules/core/types';
import { MediaService } from '@/modules/media/services';

import { getUserConfig } from '@/modules/user/helpers';

import { CaptchaActionType, CaptchaType } from '../constants';
import { Guest, ReqUser } from '../decorators';

import {
    BoundEmailCaptchaDto,
    BoundPhoneCaptchaDto,
    EmailBoundDto,
    PhoneBoundDto,
    UpdateAccountDto,
    UpdatePasswordDto,
    UploadAvatarDto,
} from '../dtos';
import { UserEntity } from '../entities';
import { CaptchaJob } from '../queue';
import { AuthService, UserService } from '../services';

/**
 * 账户中心控制器
 */

@Controller('account')
export class AccountController {
    constructor(
        protected readonly userService: UserService,
        protected readonly authService: AuthService,
        protected readonly captchaJob: CaptchaJob,
        protected mediaService: MediaService,
    ) {}

    /**
     * 获取用户个人信息
     * @param user
     */
    @Get('profile/:item?')
    @Guest()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async profile(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Param('item', new OptionalUUIDPipe()) item?: string,
    ) {
        if (isNil(item) && isNil(user)) throw new NotFoundException();
        return this.userService.detail(item ?? user.id);
    }

    /**
     * 更新账户信息
     * @param user
     * @param data
     */
    @Patch()
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async update(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body()
        data: UpdateAccountDto,
    ) {
        return this.userService.update({ id: user.id, ...pick(data, ['username', 'nickname']) });
    }

    /**
     * 更改密码
     * @param user
     * @param data
     */
    @Patch('reset-passowrd')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async resetPassword(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: UpdatePasswordDto,
    ): Promise<UserEntity> {
        return this.userService.updatePassword(user, data);
    }

    /**
     * 发送手机绑定验证码
     * @param data
     */
    @Post('send-phone-bound')
    async sendBoundPhone(@Body() data: BoundPhoneCaptchaDto) {
        return this.captchaJob.send({
            data,
            action: CaptchaActionType.ACCOUNTBOUND,
            type: CaptchaType.SMS,
            message: 'can not send sms for bind phone',
        });
    }

    /**
     * 发送邮件绑定验证码
     * @param data
     */
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
     * 绑定或更改手机号
     * @param user
     * @param data
     */
    @Patch('bound-phone')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async boundPhone(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: PhoneBoundDto,
    ): Promise<UserEntity> {
        return this.authService.boundCaptcha(user, {
            ...data,
            type: CaptchaType.SMS,
            value: data.phone,
        });
    }

    /**
     * 绑定或更改邮箱
     * @param user
     * @param data
     */
    @Patch('bound-email')
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

    @Post('avatar')
    async uploadAvatar(
        @Body() { image }: UploadAvatarDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.mediaService.upload({
            file: image,
            dir: 'avatars',
            user,
            relation: { entity: UserEntity, field: 'avatar', id: user.id },
        });
    }

    @Get('avatar')
    @Guest()
    async defaultAvatar(@Res({ passthrough: true }) res: FastifyReply) {
        const avatar = getUserConfig<string>('avatar');
        if (!existsSync(avatar)) throw new NotFoundException('file not exists!');
        const image = createReadStream(avatar);
        res.type(lookup(avatar) as string);
        return new StreamableFile(image);
    }
}
