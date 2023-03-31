import path from 'path';

import { env } from '@/modules/core/helpers';
import { CoreOptions } from '@/modules/core/types';

export const smtp: CoreOptions['smtp'] = () => ({
    host: env('SMTP_HOST', 'localhost'),
    user: env('SMTP_USER', 'test'),
    password: env('SMTP_PASSWORD', ''),
    from: env('SMTP_FROM', '平克小站<support@localhost>'),
    port: env('SMTP_PORT', (v) => Number(v), 25),
    secure: env('SMTP_SSL', (v) => JSON.parse(v), false),
    // Email模板路径
    resource: path.resolve(__dirname, '../assets/emails'),
});
