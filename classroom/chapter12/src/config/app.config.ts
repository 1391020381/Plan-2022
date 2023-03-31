import { createAppConfig } from '@/modules/core/helpers/options';

/**
 * 应用配置
 */
export const app = createAppConfig((configure) => ({
    // 监听地址
    // host: configure.env('APP_HOST', '127.0.0.1'),
    // 监听端口
    // port: configure.env('APP_PORT', (v) => toNumber(v), 3000),
    // 是否开启https
    // https: configure.env('APP_PORT', (v) => toBoolean(v), false),
    // 默认时区
    // timezone: configure.env('APP_TIMEZONE', 'Asia/Shanghai'),
    // 默认本地化语言
    // locale: configure.env('APP_LOCALE', 'zh-cn'),
    // 是否启用websockets服务
    websockets: true,
}));
