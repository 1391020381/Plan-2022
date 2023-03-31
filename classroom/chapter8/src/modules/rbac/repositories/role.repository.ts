import { BaseRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { RoleEntity } from '../entities';

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
