import { Injectable } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { BaseService } from '@/modules/database/base';

import { ManageCreateCategoryDto, ManageUpdateCategoryDto } from '../dtos/manage';
import { CategoryEntity } from '../entities';
import { CategoryRepository } from '../repositories';

/**
 * @description 分类服务
 * @export
 * @class CategoryService
 */
@Injectable()
export class CategoryService extends BaseService<CategoryEntity, CategoryRepository> {
    constructor(protected categoryRepository: CategoryRepository) {
        super(categoryRepository);
    }

    protected enable_trash = true;

    /**
     * @description 查询分类树
     */
    async findTrees() {
        return this.repository.findTrees();
    }

    /**
     * @description 新增分类
     * @param {CreateCategoryDto} data
     */
    async create(data: ManageCreateCategoryDto) {
        const item = await this.repository.save({
            ...data,
            parent: await this.getParent(data.parent),
        });
        return this.detail(item.id);
    }

    /**
     * @description 更新分类
     * @param {UpdateCategoryDto} data
     */
    async update(data: ManageUpdateCategoryDto) {
        const parent = await this.getParent(data.parent);
        const querySet = omit(data, ['id', 'parent']);
        if (Object.keys(querySet).length > 0) {
            await this.repository.update(data.id, querySet);
        }
        const cat = await this.detail(data.id);
        const shouldUpdateParent =
            (!isNil(cat.parent) && !isNil(parent) && cat.parent.id !== parent.id) ||
            (isNil(cat.parent) && !isNil(parent)) ||
            (!isNil(cat.parent) && isNil(parent));
        // 父分类单独更新
        if (parent !== undefined && shouldUpdateParent) {
            cat.parent = parent;
            await this.repository.save(cat);
        }
        return cat;
    }

    /**
     * @description 获取请求传入的父分类
     * @protected
     * @param {string} [id]
     */
    protected async getParent(id?: string) {
        let parent: CategoryEntity | undefined;
        if (id !== undefined) {
            if (id === null) return null;
            parent = await this.repository.findOne({ where: { id } });
            if (!parent)
                throw new EntityNotFoundError(CategoryEntity, `Parent category ${id} not exists!`);
        }
        return parent;
    }
}
