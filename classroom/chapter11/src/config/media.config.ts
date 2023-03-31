import { ConfigureFactory } from '@/modules/core/types';
import { defaultMediaConfig } from '@/modules/media/helpers';
import { MediaConfig } from '@/modules/media/types';

export const media: ConfigureFactory<MediaConfig> = {
    register: () => ({
        relations: [],
    }),
    defaultRegister: defaultMediaConfig,
};
