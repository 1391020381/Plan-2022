import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

/**
 * 消息与接收者的中间关联表
 */
@Entity('users_recevies')
export class MessagerecevieEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ comment: '是否已读', default: false })
    readed?: boolean;

    @ManyToOne(() => MessageEntity, (message) => message.recevies, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    message!: MessageEntity;

    @ManyToOne(() => UserEntity, (recevie) => recevie.messages, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    recevier!: UserEntity;
}
