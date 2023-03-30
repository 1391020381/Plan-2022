import { DataSource, EventSubscriber } from 'typeorm';

import { PostBodyType } from '../constants';
import { PostEntity } from '../entities';
import { PostRepository } from '../repositories/post.repository';
import { SanitizeService } from '../services';
// 订阅者的作用在于可以在CRUD数据时创建一个钩子方法执行额外的操作。
// 使用TypeORM订阅者, 你可以监听特定的实体事件。
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
        // 标识 subscriber 只监听 PostEntity的事件
        return PostEntity;
    }

    /**
     * 加载文章数据的处理
     * @param entity
     */
    async afterLoad(entity: PostEntity) {
        console.log('subscribers:');
        if (entity.type === PostBodyType.HTML) {
            entity.body = this.sanitizeService.sanitize(entity.body);
        }
    }
}
