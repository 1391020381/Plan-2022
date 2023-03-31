import { ClassToPlain } from '@/modules/core/types';

import { PostEntity } from './entities';

export type PostSearchBody = Pick<
    ClassToPlain<PostEntity>,
    'title' | 'body' | 'summary' | 'author'
>;
