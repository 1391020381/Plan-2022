import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { Pagination } from 'nestjs-typeorm-paginate';
import { EntityNotFoundError } from 'typeorm';

import { manualPaginate } from '@/modules/core/helpers';
import { PaginateDto } from '@/modules/core/types';

import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryEntity } from '../entities';

import { CategoryRepository } from '../repositories/category.repository';

/**
 * @description 分类服务
 * @export
 * @class CategoryService
 */
@Injectable()
export class CategoryService {
    constructor(protected categoryRepository: CategoryRepository) {}

    /**
     * @description 查询分类树
     */
    async findTrees() {
        return this.categoryRepository.findTrees();
    }

    /**
     * 获取分类列表
     * @param params
     */
    async list() {
        const tree = await this.categoryRepository.findTrees();
        return this.categoryRepository.toFlatTrees(tree);
    }

    /**
     * 分类分页数据列表
     * @param options
     */
    async paginate(options: PaginateDto) {
        const data = await this.list();
        return manualPaginate(options, data) as Pagination<CategoryEntity>;
    }

    /**
     * 分页详情
     * @param id
     */
    async detail(id: string) {
        const query = this.categoryRepository.buildBaseQuery();
        const qb = query.where('category.id = :id', { id });
        const item = await qb.getOne();
        if (!item) throw new NotFoundException(`Category ${id} not exists!`);
        return item;
    }

    /**
     * @description 新增分类
     * @param {CreateCategoryDto} data
     */
    async create(data: CreateCategoryDto) {
        const item = await this.categoryRepository.save({
            ...data,
            parent: await this.getParent(data.parent),
        });
        return this.detail(item.id);
    }

    /**
     * @description 更新分类
     * @param {UpdateCategoryDto} data
     */
    async update(data: UpdateCategoryDto) {
        const parent = await this.getParent(data.parent);
        const querySet = omit(data, ['id', 'parent']);
        if (Object.keys(querySet).length > 0) {
            await this.categoryRepository.update(data.id, querySet);
        }
        const cat = await this.detail(data.id);
        const shouldUpdateParent =
            (!isNil(cat.parent) && !isNil(parent) && cat.parent.id !== parent.id) ||
            (isNil(cat.parent) && !isNil(parent)) ||
            (!isNil(cat.parent) && isNil(parent));
        // 父分类单独更新
        if (parent !== undefined && shouldUpdateParent) {
            cat.parent = parent;
            await this.categoryRepository.save(cat);
        }
        return cat;
    }

    /**
     *  删除分类
     * @param id
     */
    async delete(id: string) {
        const item = await this.categoryRepository.findOneOrFail({
            where: { id },
        });

        return this.categoryRepository.remove(item);
    }

    /**
     * 恢复回收站中的数据
     * @param id
     */
    async restore(id: string) {
        const item = await this.categoryRepository.findOneOrFail({
            where: { id } as any,
        });
        return this.detail(item.id);
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
            parent = await this.categoryRepository.findOne({ where: { id } });
            if (!parent)
                throw new EntityNotFoundError(CategoryEntity, `Parent category ${id} not exists!`);
        }
        return parent;
    }
}
