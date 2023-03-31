/**
 * @description 传入CustomRepository装饰器的metadata数据标识
 */
export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';

/**
 * DTOValidation装饰器选项
 */
export const DTO_VALIDATION_OPTIONS = 'dto_validation_options';

/**
 * 排序方式
 */
export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

/**
 * 运行环境
 */
export enum EnvironmentType {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
    PREVIEW = 'preview',
}
