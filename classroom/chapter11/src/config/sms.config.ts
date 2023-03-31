import { SmsConfig, ConfigureFactory } from '@/modules/core/types';

export const sms: ConfigureFactory<SmsConfig> = {
    register: (configure) => ({
        sign: configure.env('SMS_QCLOUD_SING', '极客科技'),
        region: configure.env('SMS_QCLOUD_REGION', 'ap-guangzhou'),
        appid: configure.env('SMS_QCLOUD_APPID', '1400437232'),
        secretId: configure.env('SMS_QCLOUD_ID', 'your-secret-id'),
        secretKey: configure.env('SMS_QCLOUD_KEY', 'your-secret-key'),
    }),
    storage: true,
};
