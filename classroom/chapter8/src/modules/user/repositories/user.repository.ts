import { BaseRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { UserEntity } from '../entities';

@CustomRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
    protected qbName = 'user';

    buildBaseQuery() {
        return (
            this.createQueryBuilder(this.qbName)
                .leftJoinAndSelect(`${this.qbName}.roles`, 'roles')
                // .leftJoinAndSelect(`${this.qbName}.roles.permissions`, 'rolePermissions')
                .leftJoinAndSelect(`${this.qbName}.permissions`, 'permissions')
                .orderBy(`${this.qbName}.createdAt`, 'DESC')
        );
    }
}
