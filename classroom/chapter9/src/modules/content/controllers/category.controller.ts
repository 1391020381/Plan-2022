import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common';

import { Guest } from '@/modules/user/decorators';

import { QueryCategoryDto } from '../dtos/category.dto';
import { CategoryService } from '../services/category.service';

/**
 * 分类控制器
 */
@Controller('content/categories')
export class CategoryController {
    constructor(protected categoryService: CategoryService) {}

    @Get('tree')
    @Guest()
    @SerializeOptions({ groups: ['category-tree'] })
    async index() {
        return this.categoryService.findTrees();
    }

    @Get()
    @Guest()
    @SerializeOptions({ groups: ['category-list'] })
    async list(@Query() options: QueryCategoryDto) {
        return this.categoryService.paginate({ ...options, trashed: 'none' });
    }

    @Get(':item')
    @Guest()
    @SerializeOptions({ groups: ['category-detail'] })
    async detail(
        @Query() query: any,
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.categoryService.detail(item, false);
    }
}
