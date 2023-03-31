import { deepMerge } from '@/modules/core/helpers';
import { defaultMediaConfig } from '@/modules/media/helpers';
import { MediaConfig } from '@/modules/media/types';

export const media = () =>
    deepMerge(
        {
            relations: [],
        },
        defaultMediaConfig(),
        'merge',
    ) as Required<MediaConfig>;
