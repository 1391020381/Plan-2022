import { BaseRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { MessageEntity } from '../entities';

@CustomRepository(MessageEntity)
export class MessageRepository extends BaseRepository<MessageEntity> {
    protected qbName = 'message';

    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName).orderBy(`${this.qbName}.createdAt`, 'DESC');
    }
}
