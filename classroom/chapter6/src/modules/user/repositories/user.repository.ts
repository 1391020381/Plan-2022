import { BaseRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { UserEntity } from '../entities';

@CustomRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
    protected qbName = 'user';

    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName).orderBy(`${this.qbName}.createdAt`, 'DESC');
    }
}
