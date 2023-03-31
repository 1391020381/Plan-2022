import { Module, ModuleMetadata, Type } from '@nestjs/common';
import chalk from 'chalk';
import deepmerge from 'deepmerge';
import { isNil } from 'lodash';

import { ClassType, PanicOption } from '../types';

/**
 * 获取小于N的随机整数
 * @param count
 */
export const getRandomIndex = (count: number) => Math.floor(Math.random() * count);

/**
 * 生成只包含字母的固定长度的字符串
 * @param length
 */
export const getRandomCharString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

/**
 * 从列表中获取一个随机项
 * @param list
 */
export const getRandItemData = <T extends Record<string, any>>(list: T[]) => {
    return list[getRandomIndex(list.length)];
};

/**
 * 从列表中获取多个随机项组成一个新列表
 * @param list
 */
export const getRandListData = <T extends Record<string, any>>(list: T[]) => {
    const result: T[] = [];
    for (let i = 0; i < getRandomIndex(list.length); i++) {
        const random = getRandItemData<T>(list);
        if (!result.find((item) => item.id === random.id)) {
            result.push(random);
        }
    }
    return result;
};

/**
 * 检测当前值是否为Promise对象
 * @param promise
 */
export function isPromise(promise: any): promise is PromiseLike<any> {
    return !!promise && promise instanceof Promise;
}

/**
 * 检测当前函数是否为异步函数
 * @param callback
 */
export function isAsyncFn<R, A extends Array<any>>(
    callback: (...asgs: A) => Promise<R> | R,
): callback is (...asgs: A) => Promise<R> {
    const AsyncFunction = (async () => {}).constructor;
    return callback instanceof AsyncFunction === true;
}

/**
 * 用于请求验证中的boolean数据转义
 * @param value
 */
export function toBoolean(value?: string | boolean): boolean {
    if (isNil(value)) return false;
    if (typeof value === 'boolean') return value;
    try {
        return JSON.parse(value.toLowerCase());
    } catch (error) {
        return value as unknown as boolean;
    }
}

/**
 * @description 用于请求验证中转义null
 * @export
 * @param {(string | null)} [value]
 * @returns {*}  {(string | null | undefined)}
 */
export function tNull(value?: string | null): string | null | undefined {
    return value === 'null' ? null : value;
}

/**
 * 深度合并对象
 * @param x 初始值
 * @param y 新值
 * @param arrayMode 对于数组采取的策略,`replace`为直接替换,`merge`为合并数组
 */
export const deepMerge = <T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => {
    const options: deepmerge.Options = {};
    if (arrayMode === 'replace') {
        options.arrayMerge = (_d, s, _o) => s;
    } else if (arrayMode === 'merge') {
        options.arrayMerge = (_d, s, _o) => Array.from(new Set([..._d, ...s]));
    }
    return deepmerge(x, y, options) as T2 extends T1 ? T1 : T1 & T2;
};

/**
 * 创建一个动态模块
 * @param target
 * @param metaSetter
 */
export function CreateModule(
    target: string | Type<any>,
    metaSetter: () => ModuleMetadata = () => ({}),
): Type<any> {
    let ModuleClass: Type<any>;
    if (typeof target === 'string') {
        ModuleClass = class {};
        Object.defineProperty(ModuleClass, 'name', { value: target });
    } else {
        ModuleClass = target;
    }
    Module(metaSetter())(ModuleClass);
    return ModuleClass;
}

/**
 * 合并类
 * 注意: 这会无视类型和属性,方法及参数等装饰器
 * @param target
 * @param merges
 */
export function mixinTrait<T extends ClassType<any>>(target: T, merges: ClassType<any>[]): T {
    merges.forEach((mixin) => {
        Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
            if (isNil(Object.getOwnPropertyDescriptor(target.prototype, name))) {
                Object.defineProperty(
                    target.prototype,
                    name,
                    Object.getOwnPropertyDescriptor(mixin.prototype, name) || Object.create(null),
                );
            }
        });
    });
    return target;
}

/**
 * 输出命令行错误消息
 * @param option
 */
export function panic(option: PanicOption | string) {
    console.log();
    if (typeof option === 'string') {
        console.log(chalk.red(`\n❌ ${option}`));
        process.exit(1);
    }
    const { error, spinner, message, exit = true } = option;
    if (error) console.log(chalk.red(error));
    spinner ? spinner.fail(chalk.red(`\n❌${message}`)) : console.log(chalk.red(`\n❌ ${message}`));
    if (exit) process.exit(1);
}
