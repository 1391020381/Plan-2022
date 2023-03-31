import { isNil } from 'lodash';
import { DataSource, EventSubscriber } from 'typeorm';

import { BaseSubscriber } from '@/modules/core/crud';
import { SubcriberSetting } from '@/modules/core/types';

import { RoleEntity } from '../entities';
import { RoleRepository } from '../repositories';

@EventSubscriber()
export class RoleSubscriber extends BaseSubscriber<RoleEntity> {
    protected entity = RoleEntity;

    protected setting: SubcriberSetting = {
        trash: true,
    };

    constructor(protected dataSource: DataSource, protected roleRepository: RoleRepository) {
        super(dataSource, roleRepository);
    }

    async afterLoad(entity: RoleEntity) {
        if (isNil(entity.label)) {
            entity.label = entity.name;
        }
    }
}
