import { Controller } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PermissionAction } from '@/modules/rbac/constants';
import { simpleCurdOption } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';

import { BaseController } from '@/modules/restful/base.controller';
import { Crud } from '@/modules/restful/decorators/crud.decorator';
import { Depends } from '@/modules/restful/decorators/depends.decorator';

import { MediaEntity } from '../entities';
import { MediaModule } from '../media.module';
import { MediaService } from '../services';

const permissions: PermissionChecker[] = [
    async (ab) => ab.can(PermissionAction.MANAGE, MediaEntity.name),
];

@ApiTags('文件管理')
@ApiBearerAuth()
@Depends(MediaModule)
@Crud({
    id: 'media',
    enabled: [
        {
            name: 'list',
            option: simpleCurdOption(permissions, '文件查询,以分页模式展示'),
        },
        { name: 'detail', option: simpleCurdOption(permissions, '文件详情') },
        { name: 'delete', option: simpleCurdOption(permissions, '删除文件,支持批量删除') },
    ],
    dtos: {},
})
@Controller('medias')
export class MediaManageController extends BaseController<MediaService> {
    constructor(protected service: MediaService) {
        super(service);
    }
}
