import { createSmtpConfig } from '@/modules/sender/helpers';
/**
 * 默认情况下,端口会根据secure是否启用自动为25或者443
 */
export const smtp = createSmtpConfig((configure) => ({
    // host: configure.env('SMTP_HOST', 'your-smtp-host'),
    // user: configure.env('SMTP_USER', 'your-smtp-username'),
    // password: configure.env('SMTP_PASSWORD', 'your-smtp-password'),
    // port: configure.env<number>('SMTP_PORT', (v) => toNumber(v), 25),
    // secure: configure.env<boolean>('SMTP_SECURE', (v) => toBoolean(v), false),
    // // Email模板路径
    // resource: resolve(__dirname, '../../assets/emails'),
}));
