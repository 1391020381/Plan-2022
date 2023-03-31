import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '@/modules/user/entities/user.entity';

import { PermissionEntity } from './permission.entity';

@Exclude()
@Entity('rbac_roles')
export class RoleEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({
        comment: '角色名称',
    })
    name!: string;

    @Expose()
    @Column({ comment: '显示名称', nullable: true })
    label?: string;

    @Expose()
    @Column({
        comment: '角色描述',
        type: 'text',
        nullable: true,
    })
    description?: string;

    @Column({ comment: '是否为不可更改的系统角色', default: false })
    systemed?: boolean;

    @Expose({ groups: ['role-detail', 'role-list'] })
    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt!: Date;

    @Expose({ groups: ['role-detail'] })
    @Type(() => PermissionEntity)
    @ManyToMany(() => PermissionEntity, (permission) => permission.roles, {
        cascade: true,
        eager: true,
    })
    permissions!: PermissionEntity[];

    @ManyToMany(() => UserEntity, (user) => user.roles, { deferrable: 'INITIALLY IMMEDIATE' })
    @JoinTable()
    users!: UserEntity[];
}
