import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClassToPlain } from '@/modules/core/types';
import { Depends } from '@/modules/restful/decorators';

import { Guest, ReqUser } from '../decorators';

import { CredentialDto, RegisterDto } from '../dtos';
import { UserEntity } from '../entities';
import { LocalAuthGuard } from '../guards';
import { AuthService } from '../services';

import { UserModule } from '../user.module';

/**
 * Auth操作控制器
 */

@ApiTags('Auth操作')
@Depends(UserModule)
@Controller('auth')
export class AuthController {
    constructor(protected readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: '用户通过凭证(可以是用户名,邮箱,手机号等)+密码登录' })
    @Guest()
    @UseGuards(LocalAuthGuard)
    async login(@ReqUser() user: ClassToPlain<UserEntity>, @Body() _data: CredentialDto) {
        return { token: await this.authService.createToken(user.id) };
    }

    /**
     * 注销登录
     * @param req
     */
    @Post('logout')
    @ApiOperation({ summary: '用户登出账户' })
    @ApiBearerAuth()
    async logout(@Request() req: any) {
        return this.authService.logout(req);
    }

    /**
     * 使用用户名密码注册
     * @param data
     */
    @Post('register')
    @ApiOperation({ summary: '通过用户名+密码注册账户' })
    @Guest()
    async register(
        @Body()
        data: RegisterDto,
    ) {
        return this.authService.register(data);
    }
}
