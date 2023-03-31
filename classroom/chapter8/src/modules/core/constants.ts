/**
 * @description 传入CustomRepository装饰器的metadata数据标识
 */
export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

/**
 * DTOValidation装饰器选项
 */
export const DTO_VALIDATION_OPTIONS = 'dto_validation_options';

/**
 * 软删除数据查询类型
 */
export enum QueryTrashMode {
    ALL = 'all', // 包含已软删除和未软删除的数据
    ONLY = 'only', // 只包含软删除的数据
    NONE = 'none', // 只包含未软删除的数据
}

export const CRUD_OPTIONS = 'crud_options';

/**
 * 允许游客访问的装饰器常量
 */
export const ALLOW_GUEST = 'allowGuest';

export const ADDTIONAL_RELATIONS = 'additional_relations';
