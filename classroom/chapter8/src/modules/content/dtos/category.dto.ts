import { OmitType } from '@nestjs/swagger';

import { DtoValidation } from '@/modules/core/decorators';

import { ManageQueryCategoryDto } from './manage';

/**
 * 分类列表分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryCategoryDto extends OmitType(ManageQueryCategoryDto, ['trashed']) {}
