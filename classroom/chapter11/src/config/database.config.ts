import { ConfigureFactory } from '@/modules/core/types';
import { createDbOptions } from '@/modules/database/helpers';
import { DbConfigOptions, DbConfig } from '@/modules/database/types';

/**
 * 数据库配置函数
 */
export const database: ConfigureFactory<DbConfigOptions, DbConfig> = {
    register: (configure) => ({
        common: {
            charset: 'utf8mb4',
            synchronize: false,
            logging: ['error'],
        },
        connections: [
            {
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                username: 'root',
                password: configure.env('DB_PASSWORD', '123456'),
                database: configure.env('DB_NAME', 'nestplus'),
                // entities: [],
                // 自动加载模块中注册的entity
                // autoLoadEntities: true,
                // 可以在webpack热更新时保持连接,目前用不到
                // keepConnectionAlive: true,
                // 可以在开发环境下同步entity的数据结构到数据库
                synchronize: true,
            },
        ],
    }),
    hook: (configure, value) => createDbOptions(value),
};
