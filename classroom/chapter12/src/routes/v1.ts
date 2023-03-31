import * as contentControllers from '@/modules/content/controllers';
import * as contentManageControllers from '@/modules/content/controllers/manage';
import { Configure } from '@/modules/core/configure';
import { MediaManageController } from '@/modules/media/controllers/media-manage.controller';
import { MediaController } from '@/modules/media/controllers/media.controller';
import * as rbacManageControllers from '@/modules/rbac/controllers';
import { VersionOption } from '@/modules/restful/types';
import { getUserControllers } from '@/modules/user/controllers';
import { getUserManageApiTags, getUserManageControllers } from '@/modules/user/controllers/manage';

import { getUserApiTags } from '../modules/user/controllers/index';

export const v1 = async (configure: Configure): Promise<VersionOption> => ({
    routes: [
        {
            name: 'app',
            path: '/',
            controllers: [],
            doc: {
                title: '应用接口',
                description: '前端APP应用接口',
                tags: [
                    { name: '文章操作', description: '用户对文章进行的增删查改及搜索等操作' },
                    { name: '分类查询', description: '文章分类列表及详情查询' },
                    { name: '评论操作', description: '用户对评论的增删查操作' },
                    ...(await getUserApiTags(configure)),
                    {
                        name: '文件操作',
                        description: '浏览及下载文件等',
                    },
                ],
            },
            children: [
                {
                    name: 'content',
                    path: 'content',
                    controllers: Object.values(contentControllers),
                },
                {
                    name: 'user',
                    path: '',
                    controllers: await getUserControllers(configure),
                },
                {
                    name: 'media',
                    path: '',
                    controllers: [MediaController],
                },
            ],
        },
        {
            name: 'manage',
            path: 'manage',
            controllers: [],
            doc: {
                title: '管理接口',
                description: '后台管理面板接口',
                tags: [
                    { name: '分类管理', description: '内容模块-文章分类管理' },
                    { name: '文章管理', description: '内容模块-文章管理' },
                    { name: '评论管理', description: '内容模块-文章评论管理' },
                    ...(await getUserManageApiTags(configure)),
                    {
                        name: '角色管理',
                        description:
                            '默认包含super-admin等系统角色角色,但是可以增删查改(系统角色不可操作)',
                    },
                    {
                        name: '权限管理',
                        description: '权限为系统硬编码后自动同步到数据库,只能查看',
                    },
                    {
                        name: '文件管理',
                        description: '上传的动态文件管理',
                    },
                ],
            },
            children: [
                {
                    name: 'content',
                    path: 'content',
                    controllers: Object.values(contentManageControllers),
                },
                {
                    name: 'user',
                    path: '',
                    controllers: await getUserManageControllers(configure),
                },
                {
                    name: 'rbac',
                    path: 'rbac',
                    controllers: Object.values(rbacManageControllers),
                },
                {
                    name: 'media',
                    path: '',
                    controllers: [MediaManageController],
                },
            ],
        },
    ],
});
