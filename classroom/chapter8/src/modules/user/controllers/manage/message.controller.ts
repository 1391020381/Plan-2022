import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { PermissionAction } from '@/modules/rbac/constants';
import { RbacCrud } from '@/modules/rbac/decorators';

import { RbacCurdOption } from '@/modules/rbac/types';

import { QueryMessageDto } from '../../dtos';
import { MessageEntity } from '../../entities';
import { MessageService } from '../../services';

const option: RbacCurdOption = {
    rbac: [async (ab) => ab.can(PermissionAction.MANAGE, MessageEntity.name)],
};
@RbacCrud({
    id: 'message',
    enabled: [
        { name: 'detail', option },
        { name: 'list', option },
        { name: 'delete', option },
        { name: 'deleteMulti', option },
    ],
    dtos: {
        query: QueryMessageDto,
    },
})
@Controller('manage/messages')
export class MessageManageController extends BaseController<MessageService> {
    constructor(protected messageService: MessageService) {
        super(messageService);
    }
}
