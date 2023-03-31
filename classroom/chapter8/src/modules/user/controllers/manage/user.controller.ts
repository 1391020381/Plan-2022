import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { PermissionAction } from '@/modules/rbac/constants';
import { RbacCrud } from '@/modules/rbac/decorators';

import { RbacCurdOption } from '@/modules/rbac/types';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from '../../dtos';
import { UserEntity } from '../../entities';
import { UserService } from '../../services/user.service';

const option: RbacCurdOption = {
    rbac: [async (ab) => ab.can(PermissionAction.MANAGE, UserEntity.name)],
};
/**
 * 用户管理控制器
 */
@RbacCrud({
    id: 'user',
    enabled: [
        { name: 'list', option },
        { name: 'detail', option },
        { name: 'store', option },
        { name: 'update', option },
        { name: 'delete', option },
        { name: 'restore', option },
        { name: 'deleteMulti', option },
        { name: 'restoreMulti', option },
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
