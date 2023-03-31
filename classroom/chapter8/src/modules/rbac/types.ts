import { AbilityTuple, MongoAbility, MongoQuery, RawRuleFrom } from '@casl/ability';
import { ModuleRef } from '@nestjs/core';
import { FastifyRequest as Request } from 'fastify';

import { ClassToPlain, CrudMethodOption, CurdMethod, CurdOptions } from '../core/types';
import { UserEntity } from '../user/entities/user.entity';

import { PermissionEntity, RoleEntity } from './entities';

export type Role = Pick<ClassToPlain<RoleEntity>, 'name' | 'label' | 'description'> & {
    permissions: string[];
};
export type Permission<A extends AbilityTuple, C extends MongoQuery> = Pick<
    ClassToPlain<PermissionEntity<A, C>>,
    'name'
> &
    Partial<Pick<ClassToPlain<PermissionEntity<A, C>>, 'label' | 'description'>> & {
        rule: Omit<RawRuleFrom<A, C>, 'conditions'> & {
            conditions?: (user: ClassToPlain<UserEntity>) => Record<string, any>;
        };
    };

interface PermissionCheckerClass {
    handle(ability: MongoAbility, ref: ModuleRef, request?: Request): Promise<boolean>;
}

type PermissionCheckerCallback = (
    ability: MongoAbility,
    ref: ModuleRef,
    request?: Request,
) => Promise<boolean>;

export type PermissionChecker = PermissionCheckerClass | PermissionCheckerCallback;

export type RbacCurdOption = CrudMethodOption & { rbac?: PermissionChecker[] };
export interface RbacCurdItem {
    name: CurdMethod;
    option?: RbacCurdOption;
}
export type RbacCurdOptions = Omit<CurdOptions, 'enabled'> & {
    enabled: Array<CurdMethod | RbacCurdItem>;
};
