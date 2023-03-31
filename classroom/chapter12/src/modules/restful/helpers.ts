import { Type } from '@nestjs/common';
import { Routes, RouteTree } from '@nestjs/core';
import { ApiTags } from '@nestjs/swagger';
import chalk from 'chalk';
import { camelCase, isNil, omit, trim, upperFirst, isFunction } from 'lodash';

import { Configure } from '@/modules/core/configure';
import { CreateModule, isAsyncFn } from '@/modules/core/helpers';

import { CONTROLLER_DEPENDS, CRUD_OPTIONS_REGISTER } from './constants';
import { registerCrud } from './crud';
import { RestfulFactory } from './factory';

import { APIDocOption, RouteOption } from './types';

/**
 * 输出API和DOC地址
 * @param factory
 */
export async function echoApi(configure: Configure, factory: RestfulFactory) {
    const appUrl = await configure.get<string>('app.url');
    const apiUrl = await configure.get<string>('app.api');
    console.log(`- RestAPI: ${chalk.green.underline(apiUrl)}`);
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
    if (!doc.routes && doc.default) {
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
    if (doc.routes) {
        Object.entries(doc.routes).forEach(([_routeName, rdocs]) => {
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
export const getCleanRoutes = (data: RouteOption[]): RouteOption[] =>
    data.map((option) => {
        const route: RouteOption = {
            ...omit(option, 'children'),
            path: trimPath(option.path),
        };
        if (option.children && option.children.length > 0) {
            route.children = getCleanRoutes(option.children);
        } else {
            delete route.children;
        }
        return route;
    });

export const createRouteModuleTree = (
    configure: Configure,
    modules: { [key: string]: Type<any> },
    routes: RouteOption[],
    parentModule?: string,
): Promise<Routes> =>
    Promise.all(
        routes.map(async ({ name, path, children, controllers, doc }) => {
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
            for (const controller of controllers) {
                const crudRegister = Reflect.getMetadata(CRUD_OPTIONS_REGISTER, controller);
                if (!isNil(crudRegister) && isFunction(crudRegister)) {
                    const crudOptions = isAsyncFn(crudRegister)
                        ? await crudRegister(configure)
                        : crudRegister(configure);
                    registerCrud(controller, crudOptions);
                }
            }
            // 为每个没有自己添加`ApiTags`装饰器的控制器添加Tag
            if (doc?.tags && doc.tags.length > 0) {
                controllers.forEach((controller) => {
                    !Reflect.getMetadata('swagger/apiUseTags', controller) &&
                        ApiTags(
                            ...doc.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))!,
                        )(controller);
                });
            }
            // 创建路由模块,并导入所有控制器的依赖模块
            const module = CreateModule(`${upperFirst(camelCase(name))}RouteModule`, () => ({
                controllers,
                imports: depends,
            }));
            // 在modules变量中追加创建的RouteModule,防止重名
            modules[moduleName] = module;
            const route: RouteTree = { path, module };
            // 如果有子路由则进一步处理
            if (children)
                route.children = await createRouteModuleTree(
                    configure,
                    modules,
                    children,
                    moduleName,
                );
            return route;
        }),
    );

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
