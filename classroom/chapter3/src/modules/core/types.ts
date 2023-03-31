/**
 * 一个类的类型
 */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { IPaginationMeta, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

export type ClassType<T> = { new (...args: any[]): T };
export type ClassToPlain<T> = { [key in keyof T]: T[key] };
export interface CoreOptions {
    database?: TypeOrmModuleOptions;
}
/** ****************************** 数据请求 **************************** */
/**
 * 分页验证DTO接口
 *
 * @export
 * @interface PaginateDto
 */
export interface PaginateDto<C extends IPaginationMeta = IPaginationMeta>
    extends Omit<IPaginationOptions<C>, 'page' | 'limit'> {
    page: number;
    limit: number;
}

/** ****************************** 数据操作 **************************** */

/**
 * 为query添加查询的回调函数接口
 */
export type QueryHook<Entity> = (
    hookQuery: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

export interface TimeOptions {
    date?: dayjs.ConfigType;
    format?: dayjs.OptionType;
    locale?: string;
    strict?: boolean;
    zonetime?: string;
}

export interface AppConfig {
    timezone: string;
    locale: string;
}
