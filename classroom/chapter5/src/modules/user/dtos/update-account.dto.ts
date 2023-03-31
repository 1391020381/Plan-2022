import { Injectable } from '@nestjs/common';
import { OmitType } from '@nestjs/swagger';

import { DtoValidation } from '@/modules/core/decorators';

import { UpdateUserDto } from './update-user.dto';

/**
 * 更新用户验证
 */
@Injectable()
@DtoValidation({ groups: ['update'] })
export class UpdateAccountDto extends OmitType(UpdateUserDto, ['id']) {}
