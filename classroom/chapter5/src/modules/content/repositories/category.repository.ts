import { OrderType } from '@/modules/core/constants';
import { BaseTreeRepository } from '@/modules/core/crud';
import { CustomRepository } from '@/modules/core/decorators';

import { CategoryEntity } from '../entities/category.entity';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends BaseTreeRepository<CategoryEntity> {
    protected qbName = 'category';

    protected orderBy = { name: 'customOrder', order: OrderType.ASC };
}
