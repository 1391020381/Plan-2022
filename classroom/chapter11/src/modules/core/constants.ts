import { AppConfig } from './types';

/**
 * 运行环境
 */
export enum EnvironmentType {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
    PREVIEW = 'preview',
}

export const MODULE_BUILDER_REGISTER = 'module_builder_register';

/**
 * DTOValidation装饰器选项
 */
export const DTO_VALIDATION_OPTIONS = 'dto_validation_options';

/**
 * 默认应用配置
 */
export const defaultAppConfig = (): AppConfig => ({
    host: 'localhost',
    port: 3000,
    https: false,
    timezone: 'Asia/Shanghai',
    locale: 'zh-cn',
    server: false,
});
