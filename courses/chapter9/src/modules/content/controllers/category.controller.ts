import { Controller, Get, Query, SerializeOptions } from '@nestjs/common';

import { BaseControllerWithTrash } from '@/modules/restful/base';

import { Crud } from '@/modules/restful/decorators';

import { QueryCategoryTreeDto } from '../dtos';

import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoryService } from '../services';

@Crud({
    id: 'category',
    enabled: ['list', 'detail', 'store', 'update', 'delete', 'restore'],
    dtos: {
        store: CreateCategoryDto,
        update: UpdateCategoryDto,
    },
})
@Controller('categories')
export class CategoryController extends BaseControllerWithTrash<CategoryService> {
    constructor(protected service: CategoryService) {
        super(service);
    }

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async tree(@Query() options: QueryCategoryTreeDto) {
        return this.service.findTrees(options);
    }
}
