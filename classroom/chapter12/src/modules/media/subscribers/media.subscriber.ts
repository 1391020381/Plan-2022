import { extname, join } from 'path';

import { existsSync, removeSync } from 'fs-extra';
import { isNil } from 'lodash';
import { EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { App } from '@/modules/core/app';
import { BaseSubscriber } from '@/modules/database/base';

import { MediaEntity } from '../entities';

@EventSubscriber()
export class MediaSubscriber extends BaseSubscriber<MediaEntity> {
    protected entity = MediaEntity;

    async beforeInsert(event: InsertEvent<MediaEntity>) {
        if (isNil(event.entity.ext)) {
            event.entity.ext = extname(event.entity.file);
        }
    }

    async beforeUpdate(event: UpdateEvent<MediaEntity>) {
        event.entity.ext = extname(event.entity.file);
    }

    /**
     * 在删除数据时同时删除文件
     * @param event
     */
    async afterRemove(event: RemoveEvent<MediaEntity>) {
        const { file } = event.entity;
        const filePath = join(await App.configure.get('media.upload'), file);
        if (existsSync(filePath)) removeSync(filePath);
    }
}
