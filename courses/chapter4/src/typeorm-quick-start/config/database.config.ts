import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Author } from '../entity/Author';

import { Album } from '../entity/Album';

import { Category } from '../entity/Category';

import { Question } from '../entity/Question';

import { CascadeCategory } from '../entity/CascadeCategory';

import { Photo } from '../entity/Photo';

import { PhotoMetadata } from '../entity/PhotoMetadata';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '171226q2',
    database: 'typeorm-quick-start',
    entities: [Photo, PhotoMetadata, Author, Album, Category, CascadeCategory, Question],
    // eslint-disable-next-line
    // entities: ['../entity/*.ts'],
    synchronize: true,
    logging: false,
});

export { AppDataSource };
