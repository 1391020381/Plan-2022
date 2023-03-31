import { get } from 'lodash';

import { app } from '@/config/app.config';

export const getAppConfig = <T>(key?: string, defaultValue?: T): T => {
    const config = app();
    return key ? get(config, key, defaultValue) : (config as T);
};
