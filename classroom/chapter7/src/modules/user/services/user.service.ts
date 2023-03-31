import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { BaseService } from '@/modules/core/crud';
import { ClassToPlain, QueryHook } from '@/modules/core/types';
import { decrypt, encrypt, getUserConfig } from '@/modules/user/helpers';

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

    constructor(protected readonly userRepository: UserRepository) {
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
    async create(data: CreateUserDto) {
        const user = await this.userRepository.save(omit(data, ['isFirst']), { reload: true });
        return this.detail(user.id);
    }

    /**
     * 更新用户
     * @param data
     */
    async update(data: UpdateUserDto) {
        const user = await this.userRepository.save(omit(data, ['isFirst']), { reload: true });
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
        if (orderBy) qb.orderBy(`user.${orderBy}`, 'ASC');
        return qb;
    }
}
