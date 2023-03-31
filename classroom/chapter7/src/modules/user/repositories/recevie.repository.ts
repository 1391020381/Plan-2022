import { BaseRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { MessagerecevieEntity } from '../entities';

@CustomRepository(MessagerecevieEntity)
export class RecevieRepository extends BaseRepository<MessagerecevieEntity> {
    protected qbName = 'recevie';
}
