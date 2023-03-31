import { Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { MessagerecevieEntity } from './recevie.entity';

import { UserEntity } from './user.entity';

/**
 * 即时消息模型
 */
@Entity('user_messages')
export class MessageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '消息标题', nullable: true })
    title?: string;

    @Column({ comment: '消息内容', type: 'longtext' })
    body!: string;

    @Column({
        comment: '消息类型(用于客户端根据类型显示图标,点开链接地址等)',
        nullable: true,
    })
    type?: string;

    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt!: Date;

    @ManyToOne((type) => UserEntity, (user) => user.sends, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    sender!: UserEntity;

    @OneToMany((type) => MessagerecevieEntity, (recevier) => recevier.message, {
        cascade: true,
    })
    recevies!: MessagerecevieEntity[];

    recevier: MessagerecevieEntity;
}
