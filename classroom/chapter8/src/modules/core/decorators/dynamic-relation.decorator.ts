import { ObjectLiteral } from 'typeorm';

import { ADDTIONAL_RELATIONS } from '../constants';
import { DynamicRelation } from '../types';

export function AddRelations(relations: () => Array<DynamicRelation>) {
    return <E extends ObjectLiteral>(target: E) => {
        Reflect.defineMetadata(ADDTIONAL_RELATIONS, relations, target);
        return target;
    };
}
