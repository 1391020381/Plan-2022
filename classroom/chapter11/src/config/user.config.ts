import { OneToMany } from 'typeorm';

import { CommentEntity, PostEntity } from '@/modules/content/entities';
import { ConfigureFactory } from '@/modules/core/types';
import { defaultUserConfig } from '@/modules/user/helpers';
import { UserConfig } from '@/modules/user/types';

/**
 * 用户模块配置
 */
export const user: ConfigureFactory<UserConfig> = {
    register: (configure) => ({
        relations: [
            {
                column: 'posts',
                relation: OneToMany(
                    () => PostEntity,
                    (post) => post.author,
                    {
                        cascade: true,
                    },
                ),
            },
            {
                column: 'comment',
                relation: OneToMany(
                    () => CommentEntity,
                    (comment) => comment.user,
                    {
                        cascade: true,
                    },
                ),
            },
        ],
    }),
    defaultRegister: defaultUserConfig as any,
};
