/* eslint-disable new-cap */
import { Type } from '@nestjs/common';

import { BaseController } from '../base.controller';

import { CRUD_OPTIONS_REGISTER } from '../constants';

import { CurdOptionsRegister } from '../types';

export const Crud =
    (factory: CurdOptionsRegister) =>
    <T extends BaseController<any>>(Target: Type<T>) => {
        Reflect.defineMetadata(CRUD_OPTIONS_REGISTER, factory, Target);
    };
