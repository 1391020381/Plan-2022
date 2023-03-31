import { isNil } from 'lodash';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

import { getOrderByQuery } from '@/helpers';
import { OrderType } from '@/helpers/constants';
import { OrderQueryType } from '@/helpers/types';

export abstract class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
    /**
     * @description 构建查询时默认的模型对应的查询名称
     * @protected
     * @abstract
     * @type {string}
     */
    protected abstract qbName: string;

    /**
     * @description 默认排序规则，可以通过每个方法的orderBy选项进行覆盖
     * @protected
     * @type {(string | { name: string; order:)}
     */
    protected orderBy?: string | { name: string; order: `${OrderType}` };

    /**
     * 构建基础查询器
     */
    buildBaseQuery(): SelectQueryBuilder<E> {
        return this.createQueryBuilder(this.qbName);
    }

    /**
     * 返回查询器名称
     */
    getQBName() {
        return this.qbName;
    }

    /**
     * 生成排序的QueryBuilder
     * @param qb
     * @param orderBy
     */
    protected getOrderByQuery(qb: SelectQueryBuilder<E>, orderBy?: OrderQueryType) {
        const orderByQuery = orderBy ?? this.orderBy;
        return !isNil(orderByQuery) ? getOrderByQuery(qb, this.qbName, orderByQuery) : qb;
    }
}
