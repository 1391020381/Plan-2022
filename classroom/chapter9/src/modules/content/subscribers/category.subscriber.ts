import { EventSubscriber } from 'typeorm';

import { BaseSubscriber } from '@/modules/database/base';

import { SubcriberSetting } from '@/modules/database/types';

import { CategoryEntity } from '../entities/category.entity';

@EventSubscriber()
export class CategorySubscriber extends BaseSubscriber<CategoryEntity> {
    protected entity = CategoryEntity;

    protected setting: SubcriberSetting = {
        tree: true,
        trash: true,
    };
}
