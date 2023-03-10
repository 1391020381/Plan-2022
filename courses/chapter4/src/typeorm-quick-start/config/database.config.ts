import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Photo } from '../entity/Photo';

import { PhotoMetadata } from '../entity/PhotoMetadata';

import { Author } from '../entity/Author';

import { Album } from '../entity/Album';

import { Category } from '../entity/Category';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '171226q2',
    database: 'typeorm-quick-start',
    entities: [Photo, PhotoMetadata, Author, Album, Category],
    // eslint-disable-next-line
    // entities: ['../entity/*.ts'],
    synchronize: true,
    logging: false,
});

export { AppDataSource };
