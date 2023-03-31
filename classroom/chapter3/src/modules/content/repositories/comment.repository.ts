import { isNil, pick, unset } from 'lodash';
import { FindOptionsUtils, FindTreeOptions, SelectQueryBuilder, TreeRepository } from 'typeorm';

import { CustomRepository } from '@/modules/core/decorators';

import { CommentEntity } from '../entities';

@CustomRepository(CommentEntity)
export class CommentRepository extends TreeRepository<CommentEntity> {
    buildBaseQuery(): SelectQueryBuilder<CommentEntity> {
        return this.createQueryBuilder('comment')
            .leftJoinAndSelect(`comment.parent`, 'parent')
            .leftJoinAndSelect(`comment.post`, 'post');
    }

    async findTrees(options?: FindTreeOptions & { post?: string }) {
        const escapeAlias = (alias: string) => this.manager.connection.driver.escape(alias);
        const escapeColumn = (column: string) => this.manager.connection.driver.escape(column);
        const parentPropertyName = this.manager.connection.namingStrategy.joinColumnName(
            this.metadata.treeParentRelation!.propertyName,
            this.metadata.primaryColumns[0].propertyName,
        );
        const qb = this.buildBaseQuery().orderBy('comment.createdAt', 'DESC');
        if (!isNil(options?.post)) qb.where('post.id = :id', { id: options.post });
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(options, ['relations', 'depth']));
        qb.where(`${escapeAlias('comment')}.${escapeColumn(parentPropertyName)} IS NULL`);
        return qb.getMany();
    }

    /**
     * 打平并展开树
     * @param trees
     * @param level
     */
    async toFlatTrees(trees: CommentEntity[], level = 0) {
        const data: Omit<CommentEntity, 'children'>[] = [];
        for (const item of trees) {
            (item as any).level = level;
            const { children } = item;
            unset(item, 'children');
            data.push(item);
            data.push(...(await this.toFlatTrees(children, level + 1)));
        }
        return data as CommentEntity[];
    }
}
