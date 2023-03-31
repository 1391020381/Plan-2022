import { Type } from '@nestjs/common';

import { CRUD_OPTIONS } from '@/modules/core/constants';
import { BaseController } from '@/modules/core/crud';
import { Crud } from '@/modules/core/decorators';
import { PERMISSION_CHECKERS } from '@/modules/rbac/constants';

import { RbacCurdOptions, RbacCurdItem } from '../types';

export const RbacCrud =
    (options: RbacCurdOptions) =>
    <T extends BaseController<any>>(Target: Type<T>) => {
        Crud(options)(Target);
        const { enabled } = Reflect.getMetadata(CRUD_OPTIONS, Target) as RbacCurdOptions;
        for (const value of enabled) {
            const { name } = (typeof value === 'string' ? { name: value } : value) as RbacCurdItem;
            const find = enabled.find((v) => v === name || (v as any).name === name);
            const option = typeof find === 'string' ? {} : find.option ?? {};
            if (option.rbac) {
                Reflect.defineMetadata(PERMISSION_CHECKERS, option.rbac, Target.prototype, name);
            }
        }
        return Target;
    };
