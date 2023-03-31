import { createContentConfig } from '@/modules/content/helpers';

export const content = createContentConfig(() => ({
    elastic: false,
    postType: 'all',
    // postType: 'markdown', or postType: 'html',or postType: 'all
}));
