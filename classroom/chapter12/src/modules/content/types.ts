import { ClassToPlain } from '@/modules/core/types';

import { PostBodyType } from './constants';

import { PostEntity } from './entities';

export interface ContentConfig {
    elastic: boolean;
    postType: PostTypeOption;
}
export type PostTypeOption = `${PostBodyType}` | 'all';
export type PostSearchBody = Pick<
    ClassToPlain<PostEntity>,
    'title' | 'body' | 'summary' | 'author'
>;
