import path from 'path';

import { SmtpConfig, ConfigureRegister } from '@/modules/core/types';

export const smtp: ConfigureRegister<SmtpConfig> = (configure) => ({
    host: configure.env('SMTP_HOST', 'localhost'),
    user: configure.env('SMTP_USER', 'test'),
    password: configure.env('SMTP_PASSWORD', ''),
    from: configure.env('SMTP_FROM', '平克小站<support@localhost>'),
    port: configure.env('SMTP_PORT', (v) => Number(v), 25),
    secure: configure.env('SMTP_SSL', (v) => JSON.parse(v), false),
    // Email模板路径
    resource: path.resolve(__dirname, '../assets/emails'),
});
