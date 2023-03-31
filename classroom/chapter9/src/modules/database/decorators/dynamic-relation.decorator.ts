import { ObjectLiteral } from 'typeorm';

import { ADDTIONAL_RELATIONS } from '../constants';
import { DynamicRelation } from '../types';

/**
 * 添加动态关联
 * @param relations 动态关联注册器列表
 */
export function AddRelations(relations: () => Array<DynamicRelation>) {
    return <E extends ObjectLiteral>(target: E) => {
        Reflect.defineMetadata(ADDTIONAL_RELATIONS, relations, target);
        return target;
    };
}
