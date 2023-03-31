import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { UserEntity } from '../entities/user.entity';

@CustomRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
    protected qbName = 'user';

    buildBaseQuery() {
        return (
            this.createQueryBuilder(this.qbName)
                .leftJoinAndSelect(`${this.qbName}.roles`, 'roles')
                // .leftJoinAndSelect(`${this.qbName}.roles.permissions`, 'rolePermissions')
                .leftJoinAndSelect(`${this.qbName}.permissions`, 'permissions')
                .leftJoinAndSelect(`${this.qbName}.avatar`, 'avatar')
                .orderBy(`${this.qbName}.createdAt`, 'DESC')
        );
    }
}
