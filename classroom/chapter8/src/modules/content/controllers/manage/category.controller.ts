import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { PermissionAction } from '@/modules/rbac/constants';

import { RbacCrud } from '@/modules/rbac/decorators';
import { RbacCurdOption } from '@/modules/rbac/types';

import {
    ManageCreateCategoryDto,
    ManageQueryCategoryDto,
    ManageUpdateCategoryDto,
} from '../../dtos/manage';
import { CategoryEntity } from '../../entities';
import { CategoryService } from '../../services';

const option: RbacCurdOption = {
    rbac: [async (ab) => ab.can(PermissionAction.MANAGE, CategoryEntity.name)],
};
/**
 * 分类控制器
 */
@RbacCrud({
    id: 'category',
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
        query: ManageQueryCategoryDto,
        create: ManageCreateCategoryDto,
        update: ManageUpdateCategoryDto,
    },
})
@Controller('manage/content/categories')
export class CategoryManageController extends BaseController<CategoryService> {
    constructor(protected categoryService: CategoryService) {
        super(categoryService);
    }
}
