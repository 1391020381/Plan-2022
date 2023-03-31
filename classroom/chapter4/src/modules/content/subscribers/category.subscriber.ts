import { DataSource, EventSubscriber } from 'typeorm';

import { BaseSubscriber } from '@/modules/core/crud';

import { SubscriberSetting } from '@/modules/core/types';

import { CategoryEntity } from '../entities';
import { CategoryRepository } from '../repositories';

@EventSubscriber()
export class CategorySubscriber extends BaseSubscriber<CategoryEntity> {
    protected entity = CategoryEntity;

    protected setting: SubscriberSetting = {
        tree: true,
        trash: true,
    };

    constructor(
        protected dataSource: DataSource,
        protected categoryRepository: CategoryRepository,
    ) {
        super(dataSource, categoryRepository);
    }
}
