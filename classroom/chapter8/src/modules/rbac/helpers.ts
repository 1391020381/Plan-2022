import { MongoAbility } from '@casl/ability';
import { FastifyRequest as Request } from 'fastify';
import { isNil, isArray } from 'lodash';
import { ObjectLiteral } from 'typeorm';

import { PermissionAction } from './constants';

/**
 * 获取请求中的items,item,id,用于crud操作时验证数据
 * @param request
 */
export const getRequestItems = (request?: Request): string[] => {
    const { params = {}, body = {} } = (request ?? {}) as any;
    const id = params.id ?? body.id ?? params.item ?? body.item;
    const { items } = body;
    if (!isNil(id)) return [id];
    return !isNil(items) && isArray(items) ? items : [];
};

/**
 * 验证是否是数据拥有者
 * @param ability
 * @param getModels
 * @param request
 * @param permission
 */
export const checkOwner = async <E extends ObjectLiteral>(
    ability: MongoAbility,
    getModels: (items: string[]) => Promise<E[]>,
    request?: Request,
    permission?: string,
) => {
    const models = await getModels(getRequestItems(request));
    return models.every((model) => ability.can(permission ?? PermissionAction.OWNER, model));
};
