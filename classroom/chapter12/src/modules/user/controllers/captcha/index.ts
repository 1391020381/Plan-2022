import { isNil } from 'lodash';

import { Configure } from '@/modules/core/configure';
import { ClassType } from '@/modules/core/types';

import { UserEnabled } from '../../types';

import { EmailBoundController } from './email-bound.controller';
import { EmailLoginController } from './email-login.controller';
import { EmailRegisterController } from './email-register.controller';
import { EmailRetrievePasswordController } from './email-retrieve-password.controller';
import { PhoneBoundController } from './phone-bound.controller';
import { PhoneLoginController } from './phone-login.controller';
import { PhoneRegisterController } from './phone-register.controller';
import { PhoneRetrievePasswordController } from './phone-retrieve-password.controller';
import { RetrievePasswordController } from './retrieve-password.controller';

export const authCaptchaControllers = async (configure: Configure) => {
    const controllers: ClassType<any>[] = [];
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    if (isNil(await configure.get('queue'))) return controllers;
    if (configure.has('sms')) {
        if (enables.includes('phone-login')) controllers.push(PhoneLoginController);
        if (enables.includes('phone-register')) controllers.push(PhoneRegisterController);
        if (enables.includes('phone-retrieve-password'))
            controllers.push(PhoneRetrievePasswordController);
    }
    if (configure.has('email')) {
        if (enables.includes('email-login')) controllers.push(EmailLoginController);
        if (enables.includes('email-register')) controllers.push(EmailRegisterController);
        if (enables.includes('email-retrieve-password'))
            controllers.push(EmailRetrievePasswordController);
    }
    if (
        (enables.includes('phone-retrieve-password') && configure.has('sms')) ||
        (enables.includes('email-retrieve-password') && configure.has('email'))
    ) {
        controllers.push(RetrievePasswordController);
    }
    return controllers;
};

export const accountCaptchaControllers = async (configure: Configure) => {
    const controllers: ClassType<any>[] = [];
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    if (isNil(await configure.get('queue'))) return controllers;
    if (enables.includes('phone-bound') && configure.has('sms'))
        controllers.push(PhoneBoundController);
    if (enables.includes('email-bound') && configure.has('email'))
        controllers.push(EmailBoundController);
    return controllers;
};
