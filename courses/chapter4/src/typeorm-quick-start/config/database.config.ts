import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Photo } from '../entity/Photo';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '171226q2',
    database: 'typeorm-quick-start',
    entities: [Photo],
    synchronize: true,
    logging: false,
});

export { AppDataSource };
