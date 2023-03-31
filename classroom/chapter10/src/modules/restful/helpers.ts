import { Type } from '@nestjs/common';
import { Routes, RouteTree } from '@nestjs/core';
import chalk from 'chalk';
import { camelCase, omit, trim, upperFirst, isNil } from 'lodash';

import { CreateModule } from '@/modules/core/helpers';

import { getAppConfig } from '../core/helpers/app';

import { CONTROLLER_DEPENDS } from './constants';
import { RestfulFactory } from './factory';

import { ApiConfig, APIDocOption, RouteOption } from './types';

/**
 * 输出API和DOC地址
 * @param factory
 */
export function echoApi(factory: RestfulFactory) {
    const host = getAppConfig<string>('host');
    const port = getAppConfig<number>('port')!;
    const https = getAppConfig<boolean>('https');
    const appUrl = getAppConfig<string>('url', `${https ? 'https' : 'http'}://${host!}:${port}`);
    const prefix = factory.getConfig<ApiConfig['prefix']>('prefix');
    console.log(
        `- RestAPI: ${chalk.green.underline(
            prefix?.route
                ? `${appUrl}${prefix.route.length > 0 ? `/${prefix.route}` : prefix.route}`
                : appUrl,
        )}`,
    );
    console.log('- RestDocs:');
    const { default: defaultDoc, ...docs } = factory.docs;
    echoApiDocs('default', defaultDoc, appUrl);
    for (const [name, doc] of Object.entries(docs)) {
        console.log();
        echoApiDocs(name, doc, appUrl);
    }
}

/**
 * 输出一个版本的API和DOC地址
 * @param name
 * @param doc
 * @param appUrl
 */
function echoApiDocs(name: string, doc: APIDocOption, appUrl: string) {
    const getDocPath = (dpath: string) => `${appUrl}/${dpath}`;
    if (!doc.apps && doc.default) {
        console.log(
            `    [${chalk.blue(name.toUpperCase())}]: ${chalk.green.underline(
                getDocPath(doc.default.path),
            )}`,
        );
        return;
    }
    console.log(`    [${chalk.blue(name.toUpperCase())}]:`);
    if (doc.default) {
        console.log(`      default: ${chalk.green.underline(getDocPath(doc.default.path))}`);
    }
    if (doc.apps) {
        Object.entries(doc.apps).forEach(([_routeName, rdocs]) => {
            console.log(
                `      <${chalk.yellowBright.bold(rdocs.title)}>: ${chalk.green.underline(
                    getDocPath(rdocs.path),
                )}`,
            );
        });
    }
}

/**
 * 路由路径前缀处理
 * @param routePath
 * @param addPrefix
 */
export const trimPath = (routePath: string, addPrefix = true) =>
    `${addPrefix ? '/' : ''}${trim(routePath.replace('//', '/'), '/')}`;

/**
 * 遍历路由及其子孙路由以清理路径前缀
 * @param data
 */
export const getCleanRoutes = (data: RouteOption[]) =>
    data.map((option) => {
        const route: RouteOption = {
            ...omit(option, 'children'),
            path: trimPath(option.path),
        };
        if (!isNil(option.children) && option.children.length > 0) {
            route.children = getCleanRoutes(option.children);
            return route;
        }
        delete route.children;

        return route;
    });

/**
 * 生成嵌套结构的路由模块树
 * @param modules
 * @param routes
 * @param parentModule
 */

export const createRouteModuleTree = (
    modules: { [key: string]: Type<any> },
    routes: RouteOption[],
    parentModule?: string,
): Routes =>
    routes.map((option) => {
        const { name, path, controllers } = option;
        let items: RouteOption[];
        if ('children' in option) items = option.children;
        // 自动创建路由模块的名称
        const moduleName = parentModule ? `${parentModule}.${name}` : name;
        // RouteModule的名称必须唯一
        if (Object.keys(modules).includes(moduleName)) {
            throw new Error('route name should be unique in same level!');
        }
        // 获取每个控制器的依赖模块
        const depends = controllers
            .map((c) => Reflect.getMetadata(CONTROLLER_DEPENDS, c) || [])
            .reduce((o: Type<any>[], n) => {
                if (o.find((i) => i === n)) return o;
                return [...o, ...n];
            }, []);
        // 创建路由模块,并导入所有控制器的依赖模块
        const module = CreateModule(`${upperFirst(camelCase(moduleName))}RouteModule`, () => ({
            controllers,
            imports: depends,
        }));
        // 在modules变量中追加创建的RouteModule,防止重名
        modules[moduleName] = module;
        const route: RouteTree = { path, module };

        // 如果有子路由则进一步处理
        if (items) route.children = createRouteModuleTree(modules, items, moduleName);
        return route;
    });

/**
 * 生成最终路由路径(为路由路径添加自定义及版本前缀)
 * @param routePath
 * @param prefix
 * @param version
 */
export const genRoutePath = (routePath: string, prefix?: string, version?: string) =>
    trimPath(`${prefix}${version ? `/${version.toLowerCase()}/` : '/'}${routePath}`);

/**
 * 生成最终文档路径
 * @param routePath
 * @param prefix
 * @param version
 */
export const genDocPath = (routePath: string, prefix?: string, version?: string) =>
    trimPath(`${prefix}${version ? `/${version.toLowerCase()}/` : '/'}${routePath}`, false);
