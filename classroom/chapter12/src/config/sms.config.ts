import { createSmsConfig } from '@/modules/sender/helpers';

export const sms = createSmsConfig((configure) => ({
    // sign: configure.env('SMS_QCLOUD_SIGN', 'your-sign'),
    // region: configure.env('SMS_QCLOUD_REGION', 'ap-guangzhou'),
    // appid: configure.env('SMS_QCLOUD_APPID', 'your-app-id'),
    // secretId: configure.env('SMS_QCLOUD_ID', 'your-secret-id'),
    // secretKey: configure.env('SMS_QCLOUD_KEY', 'your-secret-key'),
}));
