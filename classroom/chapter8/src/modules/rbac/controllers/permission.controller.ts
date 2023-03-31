import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { PermissionAction } from '../constants';
import { RbacCrud } from '../decorators';
import { QueryPermssionDto } from '../dtos';
import { PermissionEntity } from '../entities';
import { PermissionService } from '../services';
import { RbacCurdOption } from '../types';

const option: RbacCurdOption = {
    rbac: [async (ab) => ab.can(PermissionAction.MANAGE, PermissionEntity)],
};
@RbacCrud({
    id: 'permission',
    enabled: [
        { name: 'list', option },
        { name: 'detail', option },
    ],
    dtos: {
        query: QueryPermssionDto,
    },
})
@Controller('manage/permissions')
export class PermissionController extends BaseController<PermissionService> {
    constructor(protected permissionService: PermissionService) {
        super(permissionService);
    }
}
