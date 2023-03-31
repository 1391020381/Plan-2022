import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { isNil, isArray, omit } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { BaseService } from '@/modules/core/crud';
import { ClassToPlain, QueryHook } from '@/modules/core/types';
import { SystemRoles } from '@/modules/rbac/constants';
import { decrypt, encrypt, getUserConfig } from '@/modules/user/helpers';

import { RoleRepository } from '../../rbac/repositories/role.repository';
import { CreateUserDto, QueryUserDto, UpdatePassword, UpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';
import { UserConfig } from '../types';

/**
 * 用户管理服务
 */
@Injectable()
export class UserService extends BaseService<UserEntity, UserRepository> implements OnModuleInit {
    protected enable_trash = true;

    constructor(
        protected readonly userRepository: UserRepository,
        protected roleRepository: RoleRepository,
    ) {
        super(userRepository);
    }

    async onModuleInit() {
        const adminConf = getUserConfig<UserConfig['super']>('super');
        const admin = await this.findOneByCredential(adminConf.username);
        if (!isNil(admin)) {
            if (!admin.isFirst) {
                await UserEntity.save({ id: admin.id, isFirst: true });
                return this.findOneByCredential(adminConf.username);
            }
            return admin;
        }
        return this.create({ ...adminConf, isFirst: true } as any);
    }

    /**
     * 创建用户
     * @param data
     */
    async create({ roles, permissions, ...data }: CreateUserDto) {
        const user = await this.userRepository.save(omit(data, ['isFirst']), { reload: true });
        if (isArray(roles) && roles.length > 0) {
            await this.userRepository
                .createQueryBuilder('user')
                .relation('roles')
                .of(user)
                .add(roles);
        }
        if (isArray(permissions) && permissions.length > 0) {
            await this.userRepository
                .createQueryBuilder('user')
                .relation('permissions')
                .of(user)
                .add(permissions);
        }
        await this.syncActived(await this.detail(user.id));
        return this.detail(user.id);
    }

    /**
     * 更新用户
     * @param data
     */
    async update({ roles, permissions, ...data }: UpdateUserDto) {
        const user = await this.userRepository.save(omit(data, ['isFirst']), { reload: true });
        const detail = await this.detail(user.id);
        if (isArray(roles) && roles.length > 0) {
            await this.userRepository
                .createQueryBuilder('user')
                .relation('roles')
                .of(detail)
                .addAndRemove(roles, detail.roles ?? []);
        }
        if (isArray(permissions) && permissions.length > 0) {
            await this.userRepository
                .createQueryBuilder('user')
                .relation('permissions')
                .of(user)
                .addAndRemove(permissions, detail.permissions ?? []);
        }
        await this.syncActived(await this.detail(user.id));
        return this.detail(user.id);
    }

    async delete(id: string, trash = true) {
        const item = await this.repository.findOneOrFail({
            where: { id },
            withDeleted: this.enable_trash ? true : undefined,
        });
        if (item.isFirst) throw new ForbiddenException('Can not delete first super admin user!');
        if (this.enable_trash && trash && isNil(item.deletedAt)) {
            // await this.repository.softRemove(item);
            item.deletedAt = new Date();
            await this.repository.save(item);
            return this.detail(id, true);
        }
        return this.repository.remove(item);
    }

    /**
     * 更新用户密码
     * @param user
     * @param param1
     */
    async updatePassword(user: UserEntity, { password, oldPassword }: UpdatePassword) {
        const item = await this.userRepository.findOneOrFail({
            select: ['password'],
            where: { id: user.id },
        });
        if (decrypt(item.password, oldPassword))
            throw new ForbiddenException('old password not matched');
        item.password = encrypt(password);
        await this.userRepository.save(item);
        return this.detail(item.id);
    }

    /**
     * 根据用户用户凭证查询用户
     * @param credential
     * @param callback
     */
    async findOneByCredential(credential: string, callback?: QueryHook<UserEntity>) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        return query
            .where('user.username = :credential', { credential })
            .orWhere('user.email = :credential', { credential })
            .orWhere('user.phone = :credential', { credential })
            .getOne();
    }

    /**
     * 根据对象条件查找用户,不存在则抛出异常
     * @param condition
     * @param callback
     */
    async findOneByCondition(condition: { [key: string]: any }, callback?: QueryHook<UserEntity>) {
        let query = this.userRepository.buildBaseQuery();
        if (callback) {
            query = await callback(query);
        }
        const wheres = Object.fromEntries(
            Object.entries(condition).map(([key, value]) => [key, value]),
        );
        const user = query.where(wheres).getOne();
        if (!user) {
            throw new EntityNotFoundError(UserEntity, Object.keys(condition).join(','));
        }
        return user;
    }

    async getCurrentUser(user?: ClassToPlain<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOneOrFail({ where: { id: user.id } });
    }

    /**
     * 根据用户的actived字段同步角色和权限
     * @param user
     */
    protected async syncActived(user: UserEntity) {
        const roleRelation = this.userRepository.createQueryBuilder().relation('roles').of(user);
        const permissionRelation = this.userRepository
            .createQueryBuilder()
            .relation('permissions')
            .of(user);
        if (user.actived) {
            const roleNames = (user.roles ?? []).map(({ name }) => name);
            const noRoles =
                roleNames.length <= 0 ||
                (!roleNames.includes(SystemRoles.USER) && !roleNames.includes(SystemRoles.ADMIN));
            const isSuperAdmin = roleNames.includes(SystemRoles.ADMIN);

            // 为普通用户添加custom-user角色
            // 为超级管理员添加super-admin角色
            if (noRoles) {
                const customRole = await this.roleRepository.findOne({
                    relations: ['users'],
                    where: { name: SystemRoles.USER },
                });
                if (!isNil(customRole)) await roleRelation.add(customRole);
            } else if (isSuperAdmin) {
                const adminRole = await this.roleRepository.findOne({
                    relations: ['users'],
                    where: { name: SystemRoles.ADMIN },
                });
                if (!isNil(adminRole)) await roleRelation.addAndRemove(adminRole, user.roles);
            }
        } else {
            // 清空禁用用户的角色和权限
            await roleRelation.remove((user.roles ?? []).map(({ id }) => id));
            await permissionRelation.remove((user.permissions ?? []).map(({ id }) => id));
        }
    }

    protected async buildListQuery(
        queryBuilder: SelectQueryBuilder<UserEntity>,
        options: QueryUserDto,
        callback?: QueryHook<UserEntity>,
    ) {
        const { actived, orderBy } = options;
        const qb = await super.buildListQuery(queryBuilder, options, callback);
        if (actived !== undefined && typeof actived === 'boolean') {
            qb.andWhere('actived = :actived', { actived });
        }
        if (!isNil(options.role)) {
            qb.andWhere('roles.id IN (:...roles)', {
                roles: [options.role],
            });
        }
        if (!isNil(options.permission)) {
            qb.andWhere('permissions.id IN (:...permissions)', {
                permissions: [options.permission],
            });
        }
        if (orderBy) qb.orderBy(`user.${orderBy}`, 'ASC');
        return qb;
    }
}
