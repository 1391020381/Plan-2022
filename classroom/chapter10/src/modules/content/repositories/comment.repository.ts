import { isNil } from 'lodash';

import { SelectQueryBuilder } from 'typeorm';

import { BaseTreeRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';
import { TreeQueryParams } from '@/modules/database/types';

import { CommentEntity } from '../entities';

@CustomRepository(CommentEntity)
export class CommentRepository extends BaseTreeRepository<CommentEntity> {
    protected qbName = 'comment';

    protected orderBy = 'createdAt';

    buildBaseQuery(qb: SelectQueryBuilder<CommentEntity>): SelectQueryBuilder<CommentEntity> {
        return super
            .buildBaseQuery(qb)
            .leftJoinAndSelect(`${this.qbName}.post`, 'post')
            .leftJoinAndSelect(`${this.qbName}.user`, 'user');
    }

    async findTrees(
        params: TreeQueryParams<CommentEntity> & { post?: string } = {},
    ): Promise<CommentEntity[]> {
        return super.findTrees({
            ...params,
            addQuery: (qb) => {
                return isNil(params.post) ? qb : qb.where('post.id = :id', { id: params.post });
            },
        });
    }
}
