import { BaseTreeRepository } from '@/modules/database/base';
import { OrderType, TreeChildrenResolve } from '@/modules/database/constants';
import { CustomRepository } from '@/modules/database/decorators';

import { CategoryEntity } from '../entities';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends BaseTreeRepository<CategoryEntity> {
    protected qbName = 'category';

    protected childrenResolve = TreeChildrenResolve.UP;

    protected orderBy = { name: 'customOrder', order: OrderType.ASC };
}
