import { AbilityTuple, MongoQuery, RawRuleFrom } from '@casl/ability';
import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '@/modules/user/entities';

import { RoleEntity } from './role.entity';

@Entity('rbac_permissions')
@Exclude()
export class PermissionEntity<
    A extends AbilityTuple = AbilityTuple,
    C extends MongoQuery = MongoQuery,
> {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '权限名称' })
    name!: string;

    @Expose()
    @Column({ comment: '权限显示名', nullable: true })
    label?: string;

    @Expose()
    @Column({
        comment: '权限描述',
        type: 'text',
        nullable: true,
    })
    description?: string;

    @Expose()
    @Column({ type: 'simple-json', comment: '权限规则' })
    rule!: Omit<RawRuleFrom<A, C>, 'conditions'>;

    @Expose({ groups: ['permission-list', 'permission-detail'] })
    @ManyToMany((type) => RoleEntity, (role) => role.permissions)
    @JoinTable()
    roles!: RoleEntity[];

    @ManyToMany(() => UserEntity, (user) => user.permissions)
    @JoinTable()
    users!: UserEntity[];
}
