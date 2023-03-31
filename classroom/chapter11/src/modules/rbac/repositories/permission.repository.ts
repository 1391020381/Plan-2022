import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { PermissionEntity } from '../entities/permission.entity';

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
