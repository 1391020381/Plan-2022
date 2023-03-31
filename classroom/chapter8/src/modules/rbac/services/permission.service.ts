import { Injectable } from '@nestjs/common';

import { isNil } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';

import { BaseService } from '@/modules/core/crud';

import { QueryHook } from '@/modules/core/types';

import { QueryPermssionDto } from '../dtos';
import { PermissionEntity } from '../entities';
import { PermissionRepository } from '../repositories';

@Injectable()
export class PermissionService extends BaseService<PermissionEntity, PermissionRepository> {
    constructor(protected permissionRepository: PermissionRepository) {
        super(permissionRepository);
    }

    protected async buildListQuery(
        queryBuilder: SelectQueryBuilder<PermissionEntity>,
        options: QueryPermssionDto,
        callback?: QueryHook<PermissionEntity>,
    ) {
        const qb = await super.buildListQuery(queryBuilder, options, callback);
        if (!isNil(options.role)) {
            qb.andWhere('roles.id IN (:...roles)', {
                roles: [options.role],
            });
        }
        return qb;
    }
}
