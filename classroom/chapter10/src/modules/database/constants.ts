/**
 * 排序方式
 */
export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

/**
 * @description 传入CustomRepository装饰器的metadata数据标识
 */

export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

/**
 * 软删除数据查询类型
 */
export enum QueryTrashMode {
    ALL = 'all', // 包含已软删除和未软删除的数据
    ONLY = 'only', // 只包含软删除的数据
    NONE = 'none', // 只包含未软删除的数据
}

/**
 * 树形模型在删除父级后子级的处理方式
 */
export enum TreeChildrenResolve {
    DELETE = 'delete',
    UP = 'up',
    ROOT = 'root',
}

/**
 * 动态关联元数据
 */
export const ADDTIONAL_RELATIONS = 'additional_relations';
