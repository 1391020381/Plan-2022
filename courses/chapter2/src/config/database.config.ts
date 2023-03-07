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
    password: '171226q2',
    database: '3r',
    // 因为我们目前没有涉及到数据迁移到命令编写,所以必须在启动数据库时自动根据加载的模块(Entity)来同步数据到数据库。
    synchronize: true,
    // 这样我们就不需要把每个模块的Entity逐个定死地添加到配置中 entites数组中，因为你可以在每个模块中使用TypeOrmModule.forFeature来动态的加入Entity
    autoLoadEntities: true,
});
