import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { RoleEntity } from '../entities/role.entity';

@CustomRepository(RoleEntity)
export class RoleRepository extends BaseRepository<RoleEntity> {
    protected qbName = 'role';

    buildBaseQuery() {
        return this.createQueryBuilder(this.getQBName()).leftJoinAndSelect(
            `${this.getQBName()}.permissions`,
            'permssions',
        );
    }
}
