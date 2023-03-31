import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { BaseService } from '@/modules/core/crud';
import { ClassToPlain, QueryHook } from '@/modules/core/types';

import { CreateUserDto, UpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';

/**
 * 用户管理服务
 */
@Injectable()
export class UserService extends BaseService<UserEntity, UserRepository> {
    protected enable_trash = true;

    constructor(protected readonly userRepository: UserRepository) {
        super(userRepository);
    }

    async init() {
        const old = await this.findOneByCredential('pincman');
        if (!isNil(old)) {
            const admin = await this.update({
                id: old.id,
                username: 'pincman',
                password: '123456aA$',
                email: 'pincman@qq.com',
            });
            return admin;
        }
        return this.create({
            username: 'pincman',
            password: '123456aA$',
            email: 'pincman@qq.com',
        });
    }

    /**
     * 创建用户
     * @param data
     */
    async create(data: CreateUserDto) {
        const user = await this.userRepository.save(data);
        return this.detail(user.id);
    }

    /**
     * 更新用户
     * @param data
     */
    async update({ id, ...data }: UpdateUserDto) {
        await this.userRepository.update(id, data);
        return this.detail(id);
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
            Object.entries(condition).map(([key, value]) => [`user.${key}`, value]),
        );
        const user = query.where(wheres).getOne();
        if (!user) {
            throw new EntityNotFoundError(UserEntity, Object.keys(condition).join(','));
        }
        return user;
    }

    /**
     * 对查询结果进行分页
     * @param options
     */
    async paginate(options: IPaginationOptions) {
        const query = this.userRepository.buildBaseQuery();
        return paginate<UserEntity>(query, options);
    }

    async getCurrentUser(user?: ClassToPlain<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOneOrFail({ where: { id: user.id } });
    }
}
