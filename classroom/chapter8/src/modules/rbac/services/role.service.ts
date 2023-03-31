import { ForbiddenException, Injectable } from '@nestjs/common';

import { isNil, omit } from 'lodash';
import { In, SelectQueryBuilder } from 'typeorm';

import { BaseService } from '@/modules/core/crud';
import { QueryHook } from '@/modules/core/types';

import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from '../dtos';

import { RoleEntity } from '../entities';
import { PermissionRepository, RoleRepository } from '../repositories';

@Injectable()
export class RoleService extends BaseService<RoleEntity, RoleRepository> {
    protected enable_trash = true;

    constructor(
        protected roleRepository: RoleRepository,
        protected permissionRepository: PermissionRepository,
    ) {
        super(roleRepository);
    }

    async create(data: CreateRoleDto) {
        const createRoleDto = {
            ...data,
            permissions: data.permissions
                ? await this.permissionRepository.findBy({
                      id: In(data.permissions),
                  })
                : [],
        };
        const item = await this.repository.save(createRoleDto);
        return this.detail(item.id);
    }

    async update(data: UpdateRoleDto) {
        const role = await this.detail(data.id);
        if (data.permissions) {
            await this.repository
                .createQueryBuilder('role')
                .relation(RoleEntity, 'permissions')
                .of(role)
                .addAndRemove(data.permissions, role.permissions ?? []);
        }
        await this.repository.update(data.id, omit(data, ['id', 'permissions']));
        return this.detail(data.id);
    }

    /**
     * 删除数据
     * @param id
     * @param trash
     */
    async delete(id: string, trash = true) {
        const item = await this.repository.findOneOrFail({
            where: { id } as any,
            withDeleted: this.enable_trash ? true : undefined,
        });
        if (item.systemed) {
            throw new ForbiddenException('can not remove systemed role!');
        }
        if (this.enable_trash && trash && isNil(item.deletedAt)) {
            // await this.repository.softRemove(item);
            (item as any).deletedAt = new Date();
            await this.repository.save(item);
            return this.detail(id, true);
        }
        return this.repository.remove(item);
    }

    protected async buildListQuery(
        queryBuilder: SelectQueryBuilder<RoleEntity>,
        options: QueryRoleDto,
        callback?: QueryHook<RoleEntity>,
    ) {
        const qb = await super.buildListQuery(queryBuilder, options, callback);
        qb.leftJoinAndSelect(`${this.repository.getQBName()}.users`, 'users');
        if (!isNil(options.user)) {
            qb.andWhere('users.id IN (:...users)', {
                roles: [options.user],
            });
        }
        return qb;
    }

    // async addUserRole(user: UserEntity) {
    //     if ((user.roles ?? []).length <= 0 && user.actived) {
    //         const role = await this.repository.findOne({
    //             relations: ['users'],
    //             where: { name: SystemRoles.USER },
    //         });
    //         if (!isNil(role)) {
    //             await this.roleRepository.createQueryBuilder().relation('users').of(role).add(user);
    //         }
    //     } else if (!user.actived && (user.roles ?? []).length > 0) {
    //         const role = await this.repository.findOne({
    //             relations: ['users'],
    //             where: { name: SystemRoles.USER },
    //         });
    //         if (!isNil(role)) {
    //             await this.roleRepository
    //                 .createQueryBuilder()
    //                 .relation('users')
    //                 .of(role)
    //                 .remove(user);
    //         }
    //     }
    // }
}
