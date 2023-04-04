import * as contentControllers from '@/modules/content/controllers';
import { Configure } from '@/modules/core/configure';
import { ApiVersionOption } from '@/modules/restful/types';

export const v1 = async (configure: Configure): Promise<ApiVersionOption> => ({
    routes: [
        {
            name: 'app',
            path: '/',
            controllers: [],
            doc: {
                title: '应用接口',
                description: 'CMS系统的应用接口',
                tags: [
                    { name: '分类', description: '分类的增删查改操作' },
                    { name: '文章', description: '文章的增删查改操作' },
                    { name: '评论', description: '评论的增删查操作' },
                ],
            },
            children: [
                {
                    name: 'content',
                    path: 'content',
                    controllers: Object.values(contentControllers),
                },
            ],
        },
    ],
});
