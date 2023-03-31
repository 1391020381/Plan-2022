import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { PermissionAction, SystemRoles } from '../rbac/constants';
import { RbacResolver } from '../rbac/rbac.resolver';

import { MessageEntity } from './entities';

@Injectable()
export class UserRbac implements OnModuleInit {
    constructor(private moduleRef: ModuleRef) {}

    onModuleInit() {
        const resolver = this.moduleRef.get(RbacResolver, { strict: false });
        resolver.addPermissions([
            {
                name: 'message.create',
                rule: {
                    action: PermissionAction.CREATE,
                    subject: MessageEntity,
                },
            },
            {
                name: 'message.sended-manage',
                rule: {
                    action: 'sended-manage',
                    subject: MessageEntity,
                    conditions: (user) => ({
                        'sender.id': user.id,
                    }),
                },
            },
            {
                name: 'message.recevied-manage',
                rule: {
                    action: 'recevied-manage',
                    subject: MessageEntity,
                    conditions: (user) => ({
                        'recevies.recevier.id': user.id,
                    }),
                },
            },
        ]);
        resolver.addRoles([
            {
                name: SystemRoles.USER,
                permissions: ['message.create', 'message.sended-manage', 'message.recevied-manage'],
            },
        ]);
    }
}
