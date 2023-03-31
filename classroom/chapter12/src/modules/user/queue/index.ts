import { BullModule } from '@nestjs/bullmq';
import { ModuleMetadata } from '@nestjs/common';

import { isNil } from 'lodash';

import { Configure } from '@/modules/core/configure';

import { SAVE_MESSAGE_QUEUE, SEND_CAPTCHA_QUEUE } from '../constants';
import { UserEnabled } from '../types';

import { CaptchaJob } from './captcha.job';
import { CaptchaWorker } from './captcha.worker';
import { MessageJob } from './message.job';
import { MessageWorker } from './message.worker';

export * from './captcha.job';
export * from './captcha.worker';
export * from './message.job';
export * from './message.worker';
export const getUserQueue = async (configure: Configure) => {
    const metadata: ModuleMetadata = {
        imports: [],
        providers: [],
    };
    if (isNil(await configure.get('queue'))) return metadata;
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    const smsNeed = ['phone-login', 'phone-register', 'phone-retrieve-password', 'phone-bound'];
    const emailNeed = ['email-login', 'email-register', 'email-retrieve-password', 'email-bound'];
    let enableSms = false;
    let enableEmail = false;
    if (configure.has('sms') && enables.find((e) => smsNeed.includes(e))) enableSms = true;
    if (configure.has('email') && enables.find((e) => emailNeed.includes(e))) enableEmail = true;
    if (enableSms || enableEmail) {
        metadata.imports.push(
            BullModule.registerQueue({
                name: SEND_CAPTCHA_QUEUE,
            }),
        );
        metadata.providers = [...metadata.providers, CaptchaJob, CaptchaWorker];
    }

    if ((await configure.get('app.websockets')) && enables.includes('message')) {
        metadata.imports.push(
            BullModule.registerQueue({
                name: SAVE_MESSAGE_QUEUE,
            }),
        );
        metadata.providers = [...metadata.providers, MessageJob, MessageWorker];
    }
    return metadata;
};
