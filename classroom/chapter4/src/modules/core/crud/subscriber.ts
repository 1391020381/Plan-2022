import { isNil } from 'lodash';
import {
    EntityManager,
    EntitySubscriberInterface,
    EventSubscriber,
    ObjectLiteral,
    ObjectType,
    UpdateEvent,
    Repository,
    TreeRepository,
    DataSource,
} from 'typeorm';

import { SubscriberSetting } from '../types';

import { BaseRepository } from './repository';
import { BaseTreeRepository } from './tree.repository';

type SubscriberRepo<E extends ObjectLiteral> =
    | Repository<E>
    | TreeRepository<E>
    | BaseRepository<E>
    | BaseTreeRepository<E>;
/**
 * @description 基础模型观察者
 * @export
 * @abstract
 * @class BaseSubscriber
 * @implements {EntitySubscriberInterface<E>}
 * @template E
 * @template Y
 */
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
    implements EntitySubscriberInterface<E>
{
    /**
     * @description 数据库连接
     * @protected
     * @type {Connection}
     */
    protected dataSource: DataSource;

    /**
     * @description EntityManager
     * @protected
     * @type {EntityManager}
     */
    protected em!: EntityManager;

    /**
     * @description 监听的模型
     * @protected
     * @abstract
     * @type {ObjectType<E>}
     */
    protected abstract entity: ObjectType<E>;

    /**
     * @description 自定义存储类
     * @protected
     * @type {Type<SubscriberRepo<E>>}
     */
    protected repository?: SubscriberRepo<E>;

    /**
     * @description 一些相关的设置
     * @protected
     * @type {SubscriberSetting}
     */
    protected setting!: SubscriberSetting;

    constructor(dataSource: DataSource, repository?: SubscriberRepo<E>) {
        this.dataSource = dataSource;
        this.dataSource.subscribers.push(this);
        this.em = this.dataSource.manager;
        this.setRepository(repository);
        if (!this.setting) this.setting = {};
    }

    listenTo() {
        return this.entity;
    }

    async afterLoad(entity: any) {
        // 是否启用树形
        if (this.setting.tree && isNil(entity.level)) entity.level = 0;
        // 是否启用软删除
        if (this.setting.trash) entity.trashed = !!entity.deletedAt;
    }

    protected setRepository(repository?: SubscriberRepo<E>) {
        this.repository = isNil(repository)
            ? this.dataSource.getRepository(this.entity)
            : repository;
    }

    /**
     * @description 判断某个属性是否被更新
     * @protected
     * @param {keyof E} column
     * @param {UpdateEvent<E>} event
     */
    protected isUpdated(column: keyof E, event: UpdateEvent<E>) {
        return !!event.updatedColumns.find((item) => item.propertyName === column);
    }
}
