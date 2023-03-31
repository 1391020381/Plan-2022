import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '@/modules/user/entities';

import { PostBodyType } from '../constants';

import { CategoryEntity } from './category.entity';
import { CommentEntity } from './comment.entity';

/**
 * @description 文章模型
 * @export
 * @class PostEntity
 * @extends {BaseEntity}
 */
@Exclude()
@Entity('content_posts')
export class PostEntity extends BaseEntity {
    /**
     * 文章ID
     *
     * @type {string}
     * @memberof PostEntity
     */
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /**
     * 文章标题
     *
     * @type {string}
     * @memberof PostEntity
     */
    @Expose()
    @Column({ comment: '文章标题' })
    title!: string;

    /**
     * 文章内容
     *
     * @type {string}
     * @memberof PostEntity
     */
    @Expose({ groups: ['post-detail'] })
    @Column({ comment: '文章内容', type: 'longtext' })
    body!: string;

    /**
     * 文章描述
     *
     * @type {string}
     * @memberof PostEntity
     */
    @Expose()
    @Column({ comment: '文章描述', nullable: true })
    summary?: string;

    /**
     * 关键字
     *
     * @type {string[]}
     * @memberof PostEntity
     */
    @Expose()
    @Column({ comment: '关键字', type: 'simple-array', nullable: true })
    keywords?: string[];

    /**
     * 创建时间
     *
     * @type {Date}
     * @memberof PostEntity
     */
    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt!: Date;

    /**
     * 更新时间
     *
     * @type {Date}
     * @memberof PostEntity
     */
    @Expose()
    @Type(() => Date)
    @UpdateDateColumn({
        comment: '更新时间',
    })
    updatedAt!: Date;

    /**
     * @description 与分类多对多关联
     * @type {CategoryEntity[]}
     */
    @Expose()
    @Type(() => CategoryEntity)
    @ManyToMany((type) => CategoryEntity, (category) => category.posts, {
        // 在新增文章时,如果所属分类不存在则直接创建
        cascade: true,
    })
    @JoinTable()
    categories!: CategoryEntity[];

    /**
     * @description 与评论一对多关联
     * @type {CommentEntity[]}
     */
    @OneToMany((type) => CommentEntity, (comment) => comment.post, {
        cascade: true,
    })
    comments!: CommentEntity[];

    /**
     * @description 统计评论数量
     * @type {number}
     */
    @Expose()
    commentCount!: number;

    /**
     * 文章内容类型
     *
     * @type {PostBodyType}
     * @memberof PostEntity
     */
    @Expose()
    @Column({
        type: 'enum',
        enum: PostBodyType,
        default: PostBodyType.MD,
    })
    type!: PostBodyType;

    /**
     * @description 发布时间
     * @type {(Date | null)}
     */
    @Expose()
    @Column({
        comment: '发布时间',
        type: 'varchar',
        nullable: true,
    })
    publishedAt?: Date | null;

    /**
     * @description 自定义文章排序
     * @type {number}
     */
    @Expose()
    @Column({ comment: '全局文章排序', default: 0 })
    customOrder!: number;

    @Expose()
    @Column({ comment: '用户文章排序', default: 0 })
    userOrder!: number;

    @Expose()
    @ManyToOne(() => UserEntity, (user) => user.posts, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    author!: UserEntity;

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt!: Date;

    @Expose()
    trashed!: boolean;
}
