import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
} from '@nestjs/common';

import { CreateCategoryDto, QueryCategoryDto, UpdateCategoryDto } from '../dtos';

import { CategoryService } from '../services';

/**
 * @description 分类控制器
 * @export
 * @class CategoryController
 */
@Controller('categories')
export class CategoryController {
    constructor(protected categoryService: CategoryService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async index() {
        return this.categoryService.findTrees();
    }

    @Get()
    @SerializeOptions({ groups: ['category-list'] })
    async list(@Query() options: QueryCategoryDto) {
        return this.categoryService.paginate(options);
    }

    @Get(':item')
    @SerializeOptions({ groups: ['category-detail'] })
    async detail(
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.categoryService.detail(item);
    }

    @Post()
    @SerializeOptions({ groups: ['category-detail'] })
    async store(
        @Body()
        data: CreateCategoryDto,
    ) {
        return this.categoryService.create(data);
    }

    @Patch()
    @SerializeOptions({ groups: ['category-detail'] })
    async update(
        @Body()
        data: UpdateCategoryDto,
    ) {
        return this.categoryService.update(data);
    }

    @Delete(':item')
    @SerializeOptions({ groups: ['category-detail'] })
    async delete(
        @Param('item', new ParseUUIDPipe())
        item: string,
    ) {
        return this.categoryService.delete(item);
    }
}
