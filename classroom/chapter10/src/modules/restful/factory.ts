import { Injectable, INestApplication } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { trim } from 'lodash';

import { deepMerge } from '../core/helpers';

import { RestfulConfigure } from './configure';
import { genDocPath } from './helpers';
import { ApiConfig, APIDocOption, SwaggerOption, VersionOption, AppOption } from './types';

@Injectable()
export class RestfulFactory extends RestfulConfigure {
    /**
     * 文档列表
     */
    protected _docs!: {
        [version: string]: APIDocOption;
    };

    get docs() {
        return this._docs;
    }

    create(config: ApiConfig) {
        this.createConfig(config);
        this.createRoutes();
        this.createDocs();
    }

    /**
     * 整合swagger
     * @param app
     */
    factoryDocs<T extends INestApplication>(app: T) {
        const docs = Object.values(this._docs)
            .map((vdoc) => [vdoc.default, ...Object.values(vdoc.apps ?? {})])
            .reduce((o, n) => [...o, ...n], [])
            .filter((i) => !!i);

        for (const voption of docs) {
            const { title, description, version, auth, include, tags } = voption!;
            const builder = new DocumentBuilder();
            if (title) builder.setTitle(title);
            if (description) builder.setDescription(description);
            if (auth) builder.addBearerAuth();
            if (tags) {
                tags.forEach((tag) =>
                    typeof tag === 'string'
                        ? builder.addTag(tag)
                        : builder.addTag(tag.name, tag.description, tag.externalDocs),
                );
            }
            builder.setVersion(version);
            const document = SwaggerModule.createDocument(app, builder.build(), {
                include: include.length > 0 ? include : [() => undefined as any],
            });
            SwaggerModule.setup(voption!.path, app, document);
        }
    }

    getModuleImports() {
        return [...Object.values(this.modules), RouterModule.register(this.routes)];
    }

    /**
     * 创建文档
     */
    protected createDocs() {
        const versionMaps = Object.entries(this.config.versions);
        const vDocs = versionMaps.map(([name, version]) => [
            name,
            this.getVersionDoc(name, version),
        ]);
        this._docs = Object.fromEntries(vDocs);
        const defaultVersion = this.config.versions[this._default];
        // 为默认版本再次生成一个文档
        this._docs.default = this.getVersionDoc(this._default, defaultVersion, true);
    }

    /**
     * 获取Version的Open API配置
     * @param name
     * @param voption
     * @param isDefault
     */
    protected getVersionDoc(name: string, voption: VersionOption, isDefault = false) {
        const docConfig: APIDocOption = {};
        // 默认文档配置
        const defaultDoc = {
            title: voption.title!,
            description: voption.description!,
            tags: voption.tags ?? [],
            auth: voption.auth ?? false,
            version: name,
            path: trim(`${this.config.prefix?.doc}${isDefault ? '' : `/${name}`}`, '/'),
        };
        // 获取路由文档
        const versionDoc = isDefault
            ? this.getAppDoc(defaultDoc, voption.apps ?? [], undefined)
            : this.getAppDoc(defaultDoc, voption.apps ?? [], name);
        if (Object.keys(versionDoc).length > 0) {
            docConfig.apps = versionDoc;
        }
        if (!docConfig.apps) {
            docConfig.default = { ...defaultDoc, include: [] };
        }
        return docConfig;
    }

    /**
     * 获取APP的Open API配置
     * @param option
     * @param apps
     * @param parent
     */
    protected getAppDoc(
        option: Omit<SwaggerOption, 'include'>,
        apps: AppOption[],
        parent?: string,
    ) {
        const docs: { [key: string]: SwaggerOption } = {};
        for (const app of apps) {
            docs[app.name] = {
                ...deepMerge(option, app.doc, 'merge'),
                tags: Array.from(new Set([...(option.tags ?? []), ...(app.doc?.tags ?? [])])),
                path: genDocPath(app.path, this.config.prefix?.doc, parent),
                include: this.getRouteModules([{ ...app, children: app.children ?? [] }], parent),
            };
        }
        return docs;
    }
}
