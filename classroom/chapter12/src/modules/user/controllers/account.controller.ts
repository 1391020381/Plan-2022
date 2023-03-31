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

import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { createReadStream, existsSync } from 'fs-extra';
import { isNil, pick } from 'lodash';

import { lookup } from 'mime-types';

import { Configure } from '@/modules/core/configure';
import { OptionalUUIDPipe } from '@/modules/core/pipes';
import { ClassToPlain } from '@/modules/core/types';
import { MediaModule } from '@/modules/media/media.module';
import { MediaService } from '@/modules/media/services';

import { Depends } from '@/modules/restful/decorators';
import { getUserConfig } from '@/modules/user/helpers';

import { Guest, ReqUser } from '../decorators';

import { UpdateAccountDto, UpdatePasswordDto, UploadAvatarDto } from '../dtos';
import { UserEntity } from '../entities';
import { AuthService, UserService } from '../services';
import { UserModule } from '../user.module';

/**
 * 账户中心控制器
 */

@ApiTags('账户操作')
@ApiBearerAuth()
@Depends(UserModule, MediaModule)
@Controller('account')
export class AccountController {
    constructor(
        protected readonly userService: UserService,
        protected readonly authService: AuthService,
        protected mediaService: MediaService,
        protected configure: Configure,
    ) {}

    /**
     * 获取用户个人信息
     * @param user
     */
    @Get('profile/:item?')
    @ApiOperation({ summary: '查询账户信息(只有用户自己才能查询)' })
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
    @ApiOperation({ summary: '修改账户信息' })
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
    @ApiOperation({ summary: '重置密码' })
    @SerializeOptions({
        groups: ['user-detail'],
    })
    async resetPassword(
        @ReqUser() user: ClassToPlain<UserEntity>,
        @Body() data: UpdatePasswordDto,
    ): Promise<UserEntity> {
        return this.userService.updatePassword(user, data);
    }

    @Post('avatar')
    @ApiOperation({ summary: '上传头像' })
    @ApiConsumes('multipart/form-data')
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
    @ApiOperation({ summary: '获取默认头像' })
    @Guest()
    async defaultAvatar(@Res({ passthrough: true }) res: FastifyReply) {
        const avatar = await getUserConfig<string>('avatar');
        if (!existsSync(avatar)) throw new NotFoundException('file not exists!');
        const image = createReadStream(avatar);
        res.type(lookup(avatar) as string);
        return new StreamableFile(image);
    }
}
