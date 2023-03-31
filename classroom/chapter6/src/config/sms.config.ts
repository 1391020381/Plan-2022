import { env } from '@/helpers';
import { SmsOptions } from '@/modules/core/types';

export const sms: () => SmsOptions = () => ({
    sign: env('SMS_QCLOUD_SING', '极客科技'),
    region: env('SMS_QCLOUD_REGION', 'ap-guangzhou'),
    appid: env('SMS_QCLOUD_APPID', '1400437232'),
    secretId: env('SMS_QCLOUD_ID', 'your-secret-id'),
    secretKey: env('SMS_QCLOUD_KEY', 'your-secret-key'),
});
