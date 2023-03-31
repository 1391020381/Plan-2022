import { isNil } from 'lodash';
import { EventSubscriber } from 'typeorm';

import { App } from '@/modules/core/app';
import { BaseSubscriber } from '@/modules/database/base';
import { SubcriberSetting } from '@/modules/database/types';

import { PostBodyType } from '../constants';
import { PostEntity } from '../entities/post.entity';
import { SanitizeService } from '../services/sanitize.service';
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

    protected setting: SubcriberSetting = {
        trash: true,
    };

    /**
     * @description 加载文章数据的处理
     * @param {PostEntity} entity
     */
    async afterLoad(entity: PostEntity) {
        if (entity.type === PostBodyType.HTML) {
            const sanitizeService = App.app.get(SanitizeService, { strict: false });
            if (!isNil(sanitizeService)) entity.body = sanitizeService.sanitize(entity.body);
        }
    }
}
