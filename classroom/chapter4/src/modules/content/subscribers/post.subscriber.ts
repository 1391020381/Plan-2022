import { DataSource, EventSubscriber } from 'typeorm';

import { BaseSubscriber } from '@/modules/core/crud';

import { SubscriberSetting } from '@/modules/core/types';

import { PostBodyType } from '../constants';
import { PostEntity } from '../entities';
import { PostRepository } from '../repositories/post.repository';
import { SanitizeService } from '../services';

/**
 * 文章模型观察者
 *
 * @export
 * @class PostSubscriber
 * @extends {BaseSubscriber<PostEntity>}
 */
@EventSubscriber()
export class PostSubscriber extends BaseSubscriber<PostEntity> {
    protected entity = PostEntity;

    protected setting: SubscriberSetting = {
        trash: true,
    };

    constructor(
        protected dataSource: DataSource,
        protected sanitizeService: SanitizeService,
        protected postRepository: PostRepository,
    ) {
        super(dataSource, postRepository);
    }

    /**
     * @description 加载文章数据的处理
     * @param {PostEntity} entity
     */
    async afterLoad(entity: PostEntity) {
        if (entity.type === PostBodyType.HTML) {
            entity.body = this.sanitizeService.sanitize(entity.body);
        }
    }
}
