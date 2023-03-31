import { Controller, Get, SerializeOptions } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { Crud } from '@/modules/core/decorators';

import { CreateCategoryDto, QueryCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryService } from '../services';

/**
 * @description 分类控制器
 * @export
 * @class CategoryController
 */
@Crud({
    id: 'category',
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
        query: QueryCategoryDto,
        create: CreateCategoryDto,
        update: UpdateCategoryDto,
    },
})
@Controller('categories')
export class CategoryController extends BaseController<CategoryService> {
    constructor(protected categoryService: CategoryService) {
        super(categoryService);
    }

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async index() {
        this.service;
        return this.service.findTrees();
    }
}
