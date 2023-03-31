import { Configure } from '@/modules/core/configure';
import { ClassType } from '@/modules/core/types';

import { UserEnabled } from '../../types';

import { MessageManageController } from './message.controller';

import { UserManageController } from './user.controller';

export const getUserManageApiTags = async (
    configure: Configure,
): Promise<Array<{ name: string; description?: string }>> => {
    const tags: Array<{ name: string; description?: string }> = [
        { name: '用户管理', description: '管理应用的所有用户' },
    ];
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    if (enables.includes('message')) {
        tags.push({ name: '消息管理', description: '全局消息管理' });
    }
    return tags;
};
export const getUserManageControllers = async (configure: Configure): Promise<ClassType<any>[]> => {
    const controllers: ClassType<any>[] = [UserManageController];
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    if (enables.includes('message')) controllers.push(MessageManageController);
    return controllers;
};
