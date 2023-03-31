import { OneToMany } from 'typeorm';

import { CommentEntity, PostEntity } from '@/modules/content/entities';
import { createUserConfig } from '@/modules/user/helpers';

/**
 * 用户模块配置
 */

export const user = createUserConfig((configure) => ({
    enables: [
        'phone-login',
        'phone-register',
        'phone-retrieve-password',
        'phone-bound',
        'email-login',
        'email-register',
        'email-retrieve-password',
        'email-bound',
        'message',
    ],
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
}));
