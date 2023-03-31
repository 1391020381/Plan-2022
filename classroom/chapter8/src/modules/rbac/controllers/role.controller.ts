import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { PermissionAction } from '../constants';
import { RbacCrud } from '../decorators';
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from '../dtos';
import { RoleEntity } from '../entities';
import { RoleService } from '../services';
import { RbacCurdOption } from '../types';

const option: RbacCurdOption = {
    rbac: [async (ab) => ab.can(PermissionAction.MANAGE, RoleEntity)],
};
@RbacCrud({
    id: 'role',
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
        query: QueryRoleDto,
        create: CreateRoleDto,
        update: UpdateRoleDto,
    },
})
@Controller('manage/roles')
export class RoleController extends BaseController<RoleService> {
    constructor(protected roleService: RoleService) {
        super(roleService);
    }
}
