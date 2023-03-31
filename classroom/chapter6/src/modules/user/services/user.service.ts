import { ForbiddenException, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

import { BaseService } from '@/modules/core/crud';
import { ClassToPlain, QueryHook } from '@/modules/core/types';

import { CreateUserDto, QueryUserDto, UpdatePassword, UpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserRepository } from '../repositories';

// 用户查询接口
type FindParams = {
    [key in keyof Omit<QueryUserDto, 'limit' | 'page'>]: QueryUserDto[key];
};

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
        } as unknown as CreateUserDto);
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
    async update(data: UpdateUserDto) {
        const user = await this.userRepository.save(data);
        return this.detail(user.id);
    }

    /**
     * 更新用户密码
     * @param user
     * @param param1
     */
    async updatePassword(user: UserEntity, { password, oldPassword }: UpdatePassword) {
        const item = await this.findOneByCondition({ id: user.id }, async (query) =>
            query.addSelect('user.password'),
        );
        if (item?.password !== oldPassword)
            throw new ForbiddenException('old password not matched');
        item.password = password;
        await this.userRepository.save(item);
        return item;
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

    /**
     * 根据参数构建查询用户列表的Query
     * @param params
     */
    protected async getListQuery(params: FindParams = {}) {
        const { actived, orderBy } = params;
        const condition: { [key: string]: any } = {};
        let query = this.userRepository.buildBaseQuery();
        if (actived !== undefined && typeof actived === 'boolean') {
            condition['user.actived'] = actived;
        }
        if (orderBy) {
            query = query.orderBy(`user.${orderBy}`, 'ASC');
        }
        if (Object.keys(condition).length > 0) {
            query = query.where(condition);
        }
        return query;
    }
}
