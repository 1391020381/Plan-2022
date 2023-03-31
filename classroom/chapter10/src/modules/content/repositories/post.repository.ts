import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { PostEntity, CommentEntity } from '../entities';

@CustomRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> {
    protected qbName = 'post';

    buildBaseQuery() {
        // 在查询之前先查询出评论数量在添加到commentCount字段上
        return this.createQueryBuilder(this.getQBName())
            .leftJoinAndSelect(`${this.getQBName()}.categories`, 'categories')
            .leftJoinAndSelect(`${this.getQBName()}.author`, 'author')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(c.id)', 'count')
                    .from(CommentEntity, 'c')
                    .where(`c.${this.getQBName()}.id = ${this.getQBName()}.id`);
            }, 'commentCount')
            .loadRelationCountAndMap(
                `${this.getQBName()}.commentCount`,
                `${this.getQBName()}.comments`,
            );
    }
}
