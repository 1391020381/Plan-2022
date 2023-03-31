import { NotFoundException, Type } from '@nestjs/common';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';
import { isNil } from 'lodash';

import { ALLOW_GUEST, CRUD_OPTIONS } from '../constants';
import { BaseController } from '../crud/controller';

import { CurdItem, CurdMethod, CurdOptions } from '../types';

export const Crud =
    (options: CurdOptions) =>
    <T extends BaseController<any>>(Target: Type<T>) => {
        Reflect.defineMetadata(CRUD_OPTIONS, options, Target);
        const { id, enabled, dtos } = Reflect.getMetadata(CRUD_OPTIONS, Target) as CurdOptions;
        const changed: Array<CurdMethod> = [];
        // 添加验证DTO类
        for (const value of enabled) {
            const { name } = (typeof value === 'string' ? { name: value } : value) as CurdItem;
            if (changed.includes(name)) continue;
            if (name in Target.prototype) {
                const paramTypes = Reflect.getMetadata('design:paramtypes', Target.prototype, name);
                const params = [...paramTypes];
                if (name === 'store') params[0] = dtos.create;
                else if (name === 'update') params[0] = dtos.update;
                else if (name === 'list' || name === 'deleteMulti' || name === 'restoreMulti')
                    params[0] = dtos.query;
                Reflect.defineMetadata('design:paramtypes', params, Target.prototype, name);
                changed.push(name);
            }
        }
        // 添加序列化选项以及是否允许匿名访问等metadata
        for (const key of changed) {
            const find = enabled.find((v) => v === key || (v as any).name === key);
            const option = typeof find === 'string' ? {} : find.option ?? {};
            let serialize = {};
            if (isNil(option.serialize)) {
                if (['detail', 'store', 'update', 'delete', 'restore'].includes(key)) {
                    serialize = { groups: [`${id}-detail`] };
                } else if (['list', 'deleteMulti', 'restoreMulti'].includes(key)) {
                    serialize = { groups: [`${id}-list`] };
                }
            } else if (option.serialize === 'noGroup') {
                serialize = {};
            }
            Reflect.defineMetadata(CLASS_SERIALIZER_OPTIONS, serialize, Target.prototype, key);
            if (option.allowGuest) {
                Reflect.defineMetadata(ALLOW_GUEST, true, Target.prototype, key);
            }
        }
        // 对于不启用的方法返回404
        const fixedProperties = ['constructor', 'service', 'setService'];
        for (const key of Object.getOwnPropertyNames(BaseController.prototype)) {
            const isEnabled = options.enabled.find((v) =>
                typeof v === 'string' ? v === key : (v as any).name === key,
            );
            if (!isEnabled && !fixedProperties.includes(key)) {
                let method = Object.getOwnPropertyDescriptor(Target.prototype, key);
                if (isNil(method))
                    method = Object.getOwnPropertyDescriptor(BaseController.prototype, key);
                Object.defineProperty(Target.prototype, key, {
                    ...method,
                    async value(...args: any[]) {
                        return new NotFoundException();
                    },
                });
            }
        }
        return Target;
    };
