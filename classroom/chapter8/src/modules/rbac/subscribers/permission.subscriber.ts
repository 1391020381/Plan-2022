import { isNil } from 'lodash';
import { DataSource, EventSubscriber } from 'typeorm';

import { BaseSubscriber } from '@/modules/core/crud';

import { PermissionEntity } from '../entities';
import { PermissionRepository } from '../repositories';

@EventSubscriber()
export class PermssionSubscriber extends BaseSubscriber<PermissionEntity> {
    protected entity = PermissionEntity;

    constructor(
        protected dataSource: DataSource,
        protected permissionRepository: PermissionRepository,
    ) {
        super(dataSource, permissionRepository);
    }

    async afterLoad(entity: PermissionEntity) {
        if (isNil(entity.label)) {
            entity.label = entity.name;
        }
    }
}
