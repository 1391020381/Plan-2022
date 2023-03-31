import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common';

import { BaseController, QueryDetailDto } from '@/modules/core/crud';

import { Crud } from '@/modules/core/decorators';

import { Guest } from '@/modules/user/decorators';

import { QueryCategoryDto } from '../dtos';
import { CategoryService } from '../services';

/**
 * 分类控制器
 */
@Crud({
    id: 'category',
    enabled: [
        { name: 'list', option: { allowGuest: true } },
        { name: 'detail', option: { allowGuest: true } },
    ],
    dtos: {
        query: QueryCategoryDto,
    },
})
@Controller('content/categories')
export class CategoryController extends BaseController<CategoryService> {
    constructor(protected categoryService: CategoryService) {
        super(categoryService);
    }

    @Get('tree')
    @Guest()
    @SerializeOptions({ groups: ['category-tree'] })
    async index() {
        return this.service.findTrees();
    }

    @Get()
    async list(@Query() options: QueryCategoryDto) {
        return this.categoryService.paginate({ ...options, trashed: 'none' });
    }

    @Get(':item')
    async detail(
        @Query() { trashed }: QueryDetailDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.categoryService.detail(item, false);
    }
}
