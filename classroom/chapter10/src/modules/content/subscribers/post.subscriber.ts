import { isNil } from 'lodash';
import { DataSource, EventSubscriber } from 'typeorm';

import { BaseSubscriber } from '@/modules/database/base';
import { SubcriberSetting } from '@/modules/database/types';

import { PostBodyType } from '../constants';
import { PostEntity } from '../entities/post.entity';
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
    constructor(dataSource?: DataSource, protected sanitizeService?: SanitizeService) {
        super(dataSource);
    }

    protected entity = PostEntity;

    protected setting: SubcriberSetting = {
        trash: true,
    };

    /**
     * @description 加载文章数据的处理
     * @param {PostEntity} entity
     */
    async afterLoad(entity: PostEntity) {
        if (entity.type === PostBodyType.HTML && !isNil(this.sanitizeService)) {
            entity.body = this.sanitizeService.sanitize(entity.body);
        }
    }
}
