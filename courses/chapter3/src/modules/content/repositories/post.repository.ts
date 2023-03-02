import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators';

import { PostEntity } from '../entities';

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('post');
    }
}
