import { env } from '@/modules/core/helpers';
import { ApiConfig } from '@/modules/restful/types';

import { v1 } from './v1';

export const api = (): ApiConfig => ({
    title: env('API_TITLE', '3R教室'),
    description: env('API_DESCRIPTION', '3R教室TS全栈开发教程'),
    auth: true,
    prefix: { route: '', doc: 'docs' },
    default: env('API_DEFAULT_VERSION', 'v1'),
    enabled: [],
    versions: { v1 },
});
