import { Body, Controller, Get, Patch, Post, SerializeOptions } from '@nestjs/common';

import { ClassToPlain } from '@/modules/core/types';

import { CaptchaType } from '../constants';
import { Guest, ReqUser } from '../decorators';

import { EmailBoundDto, PhoneBoundDto, UpdateAccountDto, UpdatePassword } from '../dtos';
import { UserEntity } from '../entities';
import { AuthService, UserService } from '../services';

/**
 * 账户中心控制器
 */
@Controller('account')
export class AccountController {
    constructor(
        protected readonly userService: UserService,
        protected readonly authService: AuthService,
    ) {}

    @Guest()
    @Post('init')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async init(): Promise<UserEntity> {
        return this.userService.init();
    }

    /**
     * 获取用户个人信息
     * @param user
     */
    @Get('profile')
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async profile(@ReqUser() user: ClassToPlain<UserEntity>) {
        return this.userService.detail(user.id);
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
        return this.userService.update({ id: user.id, ...data });
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
        @Body() data: UpdatePassword,
    ): Promise<UserEntity> {
        return this.userService.updatePassword(user, data);
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
}
