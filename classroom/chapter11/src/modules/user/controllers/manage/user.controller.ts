import { Controller } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PermissionAction } from '@/modules/rbac/constants';
import { simpleCurdOption } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';
import { BaseController } from '@/modules/restful/base.controller';
import { Crud, Depends } from '@/modules/restful/decorators';

import { CreateUserDto, QueryUserDto, UpdateUserDto } from '../../dtos';
import { UserEntity } from '../../entities';
import { UserService } from '../../services/user.service';
import { UserModule } from '../../user.module';

const permissions: PermissionChecker[] = [
    async (ab) => ab.can(PermissionAction.MANAGE, UserEntity.name),
];
/**
 * 用户管理控制器
 */
@ApiTags('用户管理')
@ApiBearerAuth()
@Depends(UserModule)
@Crud({
    id: 'user',
    enabled: [
        { name: 'list', option: simpleCurdOption(permissions, '用户查询,以分页模式展示') },
        { name: 'detail', option: simpleCurdOption(permissions, '用户详情') },
        { name: 'store', option: simpleCurdOption(permissions, '新增用户') },
        { name: 'update', option: simpleCurdOption(permissions, '修改用户信息') },
        {
            name: 'delete',
            option: simpleCurdOption(
                permissions,
                '删除用户,支持批量删除(初始化超级管理员用户不可删除)',
            ),
        },
        {
            name: 'restore',
            option: simpleCurdOption(permissions, '恢复回收站中的用户,支持批量恢复'),
        },
    ],
    dtos: {
        list: QueryUserDto,
        store: CreateUserDto,
        update: UpdateUserDto,
    },
})
@Controller('users')
export class UserManageController extends BaseController<UserService> {
    constructor(protected userService: UserService) {
        super(userService);
    }
}
