import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { MessagerecevieEntity } from '../entities/recevie.entity';

@CustomRepository(MessagerecevieEntity)
export class RecevieRepository extends BaseRepository<MessagerecevieEntity> {
    protected qbName = 'recevie';
}
