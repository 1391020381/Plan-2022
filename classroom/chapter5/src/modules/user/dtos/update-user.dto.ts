import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { CreateUserDto } from './create-user.dto';

/**
 * 更新用户验证
 */
@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsUUID(undefined, { groups: ['update'], message: '用户ID格式不正确' })
    id!: string;
}
