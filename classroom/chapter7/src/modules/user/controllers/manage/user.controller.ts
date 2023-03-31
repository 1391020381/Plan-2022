import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { Crud } from '@/modules/core/decorators';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from '../../dtos';
import { UserService } from '../../services/user.service';

/**
 * 用户管理控制器
 */
@Crud({
    id: 'user',
    enabled: [
        'list',
        'detail',
        'store',
        'update',
        'delete',
        'restore',
        'deleteMulti',
        'restoreMulti',
    ],
    dtos: {
        query: QueryUserDto,
        create: CreateUserDto,
        update: UpdateUserDto,
    },
})
@Controller('manage/users')
export class UserManageController extends BaseController<UserService> {
    constructor(protected userService: UserService) {
        super(userService);
    }
}
