import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 数据库配置
 */
export const database = (): TypeOrmModuleOptions => ({
    charset: 'utf8mb4',
    logging: ['error'],
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '12345678',
    database: '3r',
    synchronize: true,
    autoLoadEntities: true,
});
