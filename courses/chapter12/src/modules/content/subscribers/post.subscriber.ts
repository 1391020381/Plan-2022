import { Optional } from '@nestjs/common';
import { isNil } from 'lodash';
import { DataSource, EventSubscriber } from 'typeorm';

import { BaseSubscriber } from '@/modules/database/base';

import { PostBodyType } from '../constants';
import { PostEntity } from '../entities';
import { PostRepository } from '../repositories/post.repository';
import { SanitizeService } from '../services';

/**
 * 文章模型观察者
 */
@EventSubscriber()
export class PostSubscriber extends BaseSubscriber<PostEntity> {
    constructor(
        protected dataSource: DataSource,
        protected postRepository: PostRepository,
        @Optional() protected sanitizeService?: SanitizeService,
    ) {
        super(dataSource);
    }

    protected entity = PostEntity;

    listenTo() {
        return PostEntity;
    }

    /**
     * 加载文章数据的处理
     * @param entity
     */
    async afterLoad(entity: PostEntity) {
        if (entity.type === PostBodyType.HTML && !isNil(this.sanitizeService)) {
            entity.body = this.sanitizeService.sanitize(entity.body);
        }
    }
}
