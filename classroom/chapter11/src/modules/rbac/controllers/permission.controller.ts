import { Controller } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@/modules/restful/base.controller';
import { Crud, Depends } from '@/modules/restful/decorators';

import { PermissionAction } from '../constants';
import { QueryPermssionDto } from '../dtos/permission.dto';
import { PermissionEntity } from '../entities/permission.entity';
import { simpleCurdOption } from '../helpers';
import { RbacModule } from '../rbac.module';

import { PermissionService } from '../services/permission.service';
import { PermissionChecker } from '../types';

const permissions: PermissionChecker[] = [
    async (ab) => ab.can(PermissionAction.MANAGE, PermissionEntity.name),
];
@ApiTags('权限管理')
@ApiBearerAuth()
@Depends(RbacModule)
@Crud({
    id: 'permission',
    enabled: [
        { name: 'list', option: simpleCurdOption(permissions, '权限查询,以分页模式展示') },
        { name: 'detail', option: simpleCurdOption(permissions, '权限详情') },
    ],
    dtos: {
        list: QueryPermssionDto,
    },
})
@Controller('permissions')
export class PermissionController extends BaseController<PermissionService> {
    constructor(protected permissionService: PermissionService) {
        super(permissionService);
    }
}
