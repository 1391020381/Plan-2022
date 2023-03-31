import { Exclude, Expose, Type } from 'class-transformer';

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { App } from '@/modules/core/app';
import { AddRelations } from '@/modules/database/decorators';
import { DynamicRelation } from '@/modules/database/types';
import { UserEntity } from '@/modules/user/entities';

@Exclude()
@Entity('storage_medias')
@AddRelations(async () => App.configure.get<DynamicRelation[]>('media.relations', []))
export class MediaEntity extends BaseEntity {
    [key: string]: any;

    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '文件存储位置' })
    file: string;

    @Expose()
    @Column({ comment: '文件后缀' })
    ext: string;

    @Expose()
    @ManyToOne((type) => UserEntity, (user) => user.medias, {
        nullable: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user?: UserEntity;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt!: Date;

    @Expose()
    @OneToOne((type) => UserEntity, (user) => user.avatar, {
        nullable: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn()
    member?: UserEntity;
}
