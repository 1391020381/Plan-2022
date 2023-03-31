import { Global, Module, ModuleMetadata, Type } from '@nestjs/common';

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { isArray, isNil, isObject, omit } from 'lodash';

import { DatabaseModule } from '@/modules/database/database.module';
import { RestfulModule } from '@/modules/restful/restful.module';
import { ApiConfig } from '@/modules/restful/types';

import { App } from '../app';
import { Configure } from '../configure';
import { MODULE_BUILDER_REGISTER } from '../constants';
import { CoreModule } from '../core.module';
import { AppFilter, AppIntercepter, AppPipe } from '../providers';
import {
    AppConfig,
    AppParams,
    CreateOptions,
    Creator,
    CreatorData,
    ModuleBuilderMeta,
    ModuleItem,
    ModuleOption,
} from '../types';

import { CreateModule, deepMerge, isAsyncFn } from './utils';

/**
 * 创建应用的快捷函数
 * @param options
 */
export function createApp(options: CreateOptions): Creator {
    return async () => App.create(options);
}

/**
 * 构建一个启动模块
 * @param params
 * @param options
 */
export async function createBootModule(
    params: AppParams,
    options: Pick<Partial<CreateOptions>, 'meta' | 'modules' | 'globals'>,
): Promise<{ BootModule: Type<any>; modules: ModuleItem[] }> {
    const { meta: bootMeta, modules, globals = {} } = options;
    const importModules = [...modules, CoreModule];
    if (!isNil(await params.configure.get<ApiConfig>('database', null))) {
        importModules.push(DatabaseModule);
    }
    if (!isNil(await params.configure.get<ApiConfig>('api', null))) {
        importModules.push(RestfulModule);
    }
    const imports = await createImportModules(params.configure, importModules);
    const providers: ModuleMetadata['providers'] = [];
    if (globals.pipe !== null) {
        const pipe = globals.pipe
            ? globals.pipe(params)
            : new AppPipe({
                  transform: true,
                  forbidUnknownValues: false,
                  validationError: { target: false },
              });
        providers.push({
            provide: APP_PIPE,
            useValue: pipe,
        });
    }
    if (globals.interceptor !== null) {
        providers.push({
            provide: APP_INTERCEPTOR,
            useClass: globals.interceptor ?? AppIntercepter,
        });
    }
    if (globals.filter !== null) {
        providers.push({
            provide: APP_FILTER,
            useClass: AppFilter,
        });
    }
    if (!isNil(globals.guard)) {
        providers.push({
            provide: APP_GUARD,
            useClass: globals.guard,
        });
    }
    return {
        BootModule: CreateModule('BootModule', () => {
            let meta: ModuleMetadata = {
                imports: [...imports],
                providers,
            };
            if (bootMeta) {
                meta = mergeMeta(meta, bootMeta(params));
            }
            return meta;
        }),
        modules: importModules,
    };
}

/**
 * 构建APP CLI,默认start命令应用启动监听app
 * @param builder APP构建器
 * @param listened start命令的监听回调
 */
export async function buildApp(
    builder: () => Promise<CreatorData>,
    listened?: (params: CreatorData) => () => Promise<void>,
) {
    const { app, configure } = await builder();
    const { port, host } = await configure.get<AppConfig>('app');
    await app.listen(port, host, listened({ app, configure } as any));
}

/**
 * 深度合并启动模块的metadata
 * @param meta 默认metadata
 * @param custom 自定义metadata
 */
function mergeMeta(meta: ModuleMetadata, custom: ModuleMetadata) {
    const keys = Array.from(new Set([...Object.keys(meta), ...Object.keys(custom)]));
    const useMerge = <T>(i: T, p: T) => {
        if (isArray(p)) return [...((i as any[]) ?? []), ...((p as any[]) ?? [])];
        if (isObject(p)) return deepMerge(i, p);
        return p;
    };
    const merged = Object.fromEntries(
        keys
            .map((type) => [
                type,
                useMerge(meta[type as keyof ModuleMetadata], custom[type as keyof ModuleMetadata]),
            ])
            .filter(([_, item]) => (isArray(item) ? item.length > 0 : !!item)),
    );
    return { ...meta, ...merged };
}

/**
 * 根据模块类生成导入到启动模块的模块列表
 * @param configure 配置实例
 * @param modules 模块类列表
 */
async function createImportModules(
    configure: Configure,
    modules: ModuleItem[],
): Promise<Type<any>[]> {
    return Promise.all(
        modules.map(async (item) => {
            const option: ModuleOption = 'module' in item ? item : { module: item };
            const metadata: ModuleBuilderMeta = await getModuleMeta(configure, option);
            Module(omit(metadata, ['global', 'commands']))(option.module);
            if (metadata.global) Global()(option.module);
            return option.module;
        }),
    );
}

/**
 * 根据模块构建装饰器生成medadata
 * @param configure
 * @param option
 */
async function getModuleMeta(configure: Configure, option: ModuleOption) {
    let metadata: ModuleBuilderMeta = {};
    const register = Reflect.getMetadata(MODULE_BUILDER_REGISTER, option.module);
    const params = option.params ?? {};
    if (!isNil(register)) {
        metadata = isAsyncFn(register)
            ? await register(configure, params)
            : register(configure, params);
    }
    return metadata;
}
