import { defaultAppConfig } from '@/modules/core/constants';
import { AppConfig, ConfigureFactory } from '@/modules/core/types';

/**
 * 应用配置
 */
export const app: ConfigureFactory<AppConfig> = {
    register: () => ({
        host: '127.0.0.1',
        port: 3100,
        // 默认时区
        timezone: 'Asia/Shanghai',
        // 默认语言
        locale: 'zh-cn',
    }),
    defaultRegister: defaultAppConfig,
};
