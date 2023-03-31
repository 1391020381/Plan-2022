import { Controller } from '@nestjs/common';

import { PermissionAction } from '@/modules/rbac/constants';
import { simpleCurdOption } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';

import { BaseController } from '@/modules/restful/base.controller';
import { Crud } from '@/modules/restful/decorators/crud.decorator';

import { MediaEntity } from '../entities';
import { MediaService } from '../services';

const permissions: PermissionChecker[] = [
    async (ab) => ab.can(PermissionAction.MANAGE, MediaEntity.name),
];

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
@Controller('manage/medias')
export class MediaManageController extends BaseController<MediaService> {
    constructor(protected service: MediaService) {
        super(service);
    }
}
