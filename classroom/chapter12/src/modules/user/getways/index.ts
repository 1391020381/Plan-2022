import { ModuleMetadata } from '@nestjs/common';

import { isNil } from 'lodash';

import { Configure } from '@/modules/core/configure';

import { UserEnabled } from '../types';

import { MessageGateway } from './message.gateway';

export const getWSProviders = async (
    configure: Configure,
): Promise<ModuleMetadata['providers']> => {
    const enables = await configure.get<UserEnabled[]>('user.enables', []);
    if (
        (await configure.get('app.websockets')) &&
        !isNil(await configure.get('queue')) &&
        enables.includes('message')
    ) {
        return [MessageGateway];
    }
    return [];
};
