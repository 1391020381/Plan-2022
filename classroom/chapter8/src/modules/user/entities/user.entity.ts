import { Exclude, Expose, Type } from 'class-transformer';

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AddRelations } from '@/modules/core/decorators';
import { PermissionEntity, RoleEntity } from '@/modules/rbac/entities';
import { getUserConfig } from '@/modules/user/helpers';

import { DynamicRelation } from '../../core/types';

import { AccessTokenEntity } from './access-token.entity';
import { MessageEntity } from './message.entity';
import { MessagerecevieEntity } from './recevie.entity';

/**
 * 用户模型
 */
@AddRelations(() => getUserConfig<DynamicRelation[]>('relations'))
@Exclude()
@Entity('users')
export class UserEntity extends BaseEntity {
    [key: string]: any;

    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({
        comment: '姓名',
        nullable: true,
    })
    nickname?: string;

    @Expose()
    @Column({ comment: '用户名', unique: true })
    username!: string;

    @Column({ comment: '密码', length: 500, select: false })
    password!: string;

    @Expose({ groups: ['user-detail', 'user-list'] })
    @Column({ comment: '手机号', nullable: true, unique: true })
    phone?: string;

    @Expose({ groups: ['user-detail', 'user-list'] })
    @Column({ comment: '邮箱', nullable: true, unique: true })
    email?: string;

    @Expose()
    @Column({ comment: '用户状态,是否激活', default: true })
    actived?: boolean;

    @Expose()
    @Column({ comment: '是否是第一个用户', default: false })
    isFirst?: boolean;

    @Expose({ groups: ['user-detail', 'user-list'] })
    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '用户创建时间',
    })
    createdAt!: Date;

    @Expose({ groups: ['user-detail', 'user-list'] })
    @Expose()
    @Type(() => Date)
    @UpdateDateColumn({
        comment: '用户更新时间',
    })
    updatedAt!: Date;

    @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user, {
        cascade: true,
    })
    accessTokens!: AccessTokenEntity[];

    @Expose({ groups: ['user-detail', 'user-list'] })
    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt!: Date;

    @Expose({ groups: ['user-detail', 'user-list'] })
    trashed!: boolean;

    @OneToMany((type) => MessageEntity, (message) => message.sender, {
        cascade: true,
    })
    sends!: MessageEntity[];

    @OneToMany((type) => MessagerecevieEntity, (message) => message.recevier, { cascade: true })
    messages!: MessagerecevieEntity[];

    @Expose()
    @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
    roles!: RoleEntity[];

    @Expose()
    @ManyToMany(() => PermissionEntity, (permisson) => permisson.users, {
        cascade: true,
    })
    permissions!: PermissionEntity[];
}
