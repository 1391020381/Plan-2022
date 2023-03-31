import { Controller, Get, Param, ParseUUIDPipe, Query, SerializeOptions } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Depends } from '@/modules/restful/decorators';
import { Guest } from '@/modules/user/decorators';

import { ContentModule } from '../content.module';
import { QueryCategoryDto } from '../dtos/category.dto';
import { CategoryService } from '../services/category.service';

/**
 * 分类控制器
 */
@ApiTags('分类查询')
@Depends(ContentModule)
@Controller('categories')
export class CategoryController {
    constructor(protected categoryService: CategoryService) {}

    @Get('tree')
    @ApiOperation({ summary: '查询文章分类表,以树形嵌套结构展示' })
    @Guest()
    @SerializeOptions({ groups: ['category-tree'] })
    async index() {
        return this.categoryService.findTrees();
    }

    @Get()
    @ApiOperation({ summary: '查询文章分类表,以分页形式展示' })
    @Guest()
    @SerializeOptions({ groups: ['category-list'] })
    async list(@Query() options: QueryCategoryDto) {
        return this.categoryService.paginate({ ...options, trashed: 'none' });
    }

    @Get(':item')
    @ApiOperation({ summary: '查询一个文章分类的详细信息' })
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
