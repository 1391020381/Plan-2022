import { isNil } from 'lodash';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    ObjectLiteral,
    ObjectType,
    UpdateEvent,
    InsertEvent,
    SoftRemoveEvent,
    RemoveEvent,
    RecoverEvent,
    TransactionStartEvent,
    TransactionCommitEvent,
    TransactionRollbackEvent,
    EntityTarget,
    DataSource,
} from 'typeorm';

import { ClassType } from '@/modules/core/types';

import { getCustomRepository } from '../helpers';
import { RepositoryType, SubcriberSetting } from '../types';

type SubscriberEvent<E extends ObjectLiteral> =
    | InsertEvent<E>
    | UpdateEvent<E>
    | SoftRemoveEvent<E>
    | RemoveEvent<E>
    | RecoverEvent<E>
    | TransactionStartEvent
    | TransactionCommitEvent
    | TransactionRollbackEvent;

/**
 * 基础模型观察者
 */
@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
    implements EntitySubscriberInterface<E>
{
    /**
     * 监听的模型
     */
    protected abstract entity: ObjectType<E>;

    /**
     * 一些相关的设置
     */
    protected setting!: SubcriberSetting;

    /**
     * 构造函数
     * @param dataSource 数据连接池
     */
    constructor(dataSource?: DataSource) {
        if (!isNil(dataSource)) dataSource.subscribers.push(this);
        if (!this.setting) this.setting = {};
    }

    protected getDataSource(event: SubscriberEvent<E>) {
        return event.connection;
    }

    protected getManage(event: SubscriberEvent<E>) {
        return event.manager;
    }

    protected getRepositoy<
        C extends ClassType<T>,
        T extends RepositoryType<E>,
        A extends EntityTarget<ObjectLiteral>,
    >(event: SubscriberEvent<E>, repository?: C, entity?: A) {
        return isNil(repository)
            ? this.getDataSource(event).getRepository(entity ?? this.entity)
            : getCustomRepository<T, E>(this.getDataSource(event), repository);
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

    /**
     * 判断某个属性是否被更新
     * @param cloumn
     * @param event
     */
    protected isUpdated(cloumn: keyof E, event: UpdateEvent<E>) {
        return !!event.updatedColumns.find((item) => item.propertyName === cloumn);
    }
}
