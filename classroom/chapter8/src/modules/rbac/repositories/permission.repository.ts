import { BaseRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { PermissionEntity } from '../entities';

@CustomRepository(PermissionEntity)
export class PermissionRepository extends BaseRepository<PermissionEntity> {
    protected qbName = 'permission';

    buildBaseQuery() {
        return this.createQueryBuilder(this.getQBName()).leftJoinAndSelect(
            `${this.getQBName()}.roles`,
            'roles',
        );
    }
}
