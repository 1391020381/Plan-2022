import { pick, unset } from 'lodash';
import { FindOptionsUtils, FindTreeOptions, TreeRepository } from 'typeorm';

import { CustomRepository } from '@/modules/core/decorators';

import { CategoryEntity } from '../entities/category.entity';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends TreeRepository<CategoryEntity> {
    /**
     * 构建基础查询器
     */
    buildBaseQuery() {
        return this.createQueryBuilder('category').leftJoinAndSelect('category.parent', 'parent');
    }

    /**
     * 查询顶级分类
     * @param options
     */
    findRoots(options?: FindTreeOptions) {
        const escapeAlias = (alias: string) => this.manager.connection.driver.escape(alias);
        const escapeColumn = (column: string) => this.manager.connection.driver.escape(column);
        const parentPropertyName = this.manager.connection.namingStrategy.joinColumnName(
            this.metadata.treeParentRelation!.propertyName,
            this.metadata.primaryColumns[0].propertyName,
        );
        const qb = this.buildBaseQuery().orderBy('category.customOrder', 'ASC');
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(options, ['relations', 'depth']));
        qb.where(`${escapeAlias('category')}.${escapeColumn(parentPropertyName)} IS NULL`);
        return qb.getMany();
    }

    /**
     * 创建后代查询器
     * @param alias
     * @param closureTableAlias
     * @param entity
     */
    createDescendantsQueryBuilder(
        alias: string,
        closureTableAlias: string,
        entity: CategoryEntity,
    ) {
        return super
            .createDescendantsQueryBuilder(alias, closureTableAlias, entity)
            .orderBy(`${alias}.customOrder`, 'ASC');
    }

    /**
     * 创建祖先查询器
     * @param alias
     * @param closureTableAlias
     * @param entity
     */
    createAncestorsQueryBuilder(alias: string, closureTableAlias: string, entity: CategoryEntity) {
        return super
            .createAncestorsQueryBuilder(alias, closureTableAlias, entity)
            .orderBy(`${alias}.customOrder`, 'ASC');
    }

    /**
     * 打平并展开树
     * @param trees
     * @param level
     */
    async toFlatTrees(trees: CategoryEntity[], level = 0) {
        const data: Omit<CategoryEntity, 'children'>[] = [];
        for (const item of trees) {
            (item as any).level = level;
            const { children } = item;
            unset(item, 'children');
            data.push(item);
            data.push(...(await this.toFlatTrees(children, level + 1)));
        }
        return data as CategoryEntity[];
    }
}
