import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { MediaEntity } from '../entities';

@CustomRepository(MediaEntity)
export class MediaRepository extends BaseRepository<MediaEntity> {
    protected qbName = 'media';

    buildBaseQuery() {
        return this.createQueryBuilder(this.qbName).orderBy(`${this.qbName}.createdAt`, 'DESC');
    }
}
