import { DataSource, EventSubscriber } from 'typeorm';

import { PostBodyType } from '../constants';
import { PostEntity } from '../entities';
import { PostRepository } from '../repositories/post.repository';
import { SanitizeService } from '../services';

/**
 * 文章模型观察者
 */
@EventSubscriber()
export class PostSubscriber {
    constructor(
        protected dataSource: DataSource,
        protected sanitizeService: SanitizeService,
        protected postRepository: PostRepository,
    ) {
        this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return PostEntity;
    }

    /**
     * 加载文章数据的处理
     * @param entity
     */
    async afterLoad(entity: PostEntity) {
        if (entity.type === PostBodyType.HTML) {
            entity.body = this.sanitizeService.sanitize(entity.body);
        }
    }
}
