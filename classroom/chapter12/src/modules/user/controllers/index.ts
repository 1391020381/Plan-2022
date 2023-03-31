import { Configure } from '@/modules/core/configure';
import { ClassType } from '@/modules/core/types';

import { UserEnabled } from '../types';

import { AccountController } from './account.controller';

import { AuthController } from './auth.controller';
import { accountCaptchaControllers, authCaptchaControllers } from './captcha';
import { MessageController } from './message.controller';

export const getUserApiTags = async (
    configure: Configure,
): Promise<Array<{ name: string; description?: string }>> => {
    const tags: Array<{ name: string; description?: string }> = [
        {
            name: '账户操作',
            description: '用户登录后对账户进行的更改密码,换绑手机号等一系列操作',
        },
        { name: 'Auth操作', description: '用户登录,登出,注册,发送找回密码等操作' },
    ];
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    if (enables.includes('message')) {
        tags.push({
            name: '用户消息操作',
            description: '用户作为消息发送者和接收者对消息进行增删查改及已读标注等操作',
        });
    }
    return tags;
};

export const getUserControllers = async (configure: Configure): Promise<ClassType<any>[]> => {
    const controllers: ClassType<any>[] = [
        AuthController,
        ...(await authCaptchaControllers(configure)),
        AccountController,
        ...(await accountCaptchaControllers(configure)),
    ];
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    if (enables.includes('message')) controllers.push(MessageController);
    return controllers;
};
