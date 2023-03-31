import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    DeleteDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { PostEntity } from './post.entity';

/**
 * 树形嵌套分类
 */
@Exclude()
@Tree('materialized-path')
@Entity('content_categories')
export class CategoryEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '分类名称' })
    name!: string;

    @ManyToMany((type) => PostEntity, (post) => post.categories)
    posts!: PostEntity[];

    @Expose({ groups: ['category-tree'] })
    @Type(() => CategoryEntity)
    @TreeChildren({ cascade: true })
    children!: CategoryEntity[];

    /**
     * @description 当删除父分类时,子分类变成顶级分类
     * @type {(CategoryEntity | null)}
     */
    @Expose({ groups: ['category-detail', 'category-list'] })
    @Type(() => CategoryEntity)
    @TreeParent({ onDelete: 'SET NULL' })
    parent!: CategoryEntity | null;

    /**
     * @description 分类排序
     * @type {number}
     */
    @Expose({ groups: ['category-tree', 'category-list', 'category-detail'] })
    @Column({ comment: '分类排序', default: 0 })
    customOrder!: number;

    /**
     * @description 分类嵌套等级,只在打平时使用
     */
    @Expose({ groups: ['category-list'] })
    level = 0;

    @Expose()
    @Type(() => Date)
    @DeleteDateColumn({
        comment: '删除时间',
    })
    deletedAt!: Date;

    @Expose()
    trashed!: boolean;
}
