import { Controller } from '@nestjs/common';

import { PermissionAction } from '@/modules/rbac/constants';
import { simpleCurdOption } from '@/modules/rbac/helpers';
import { PermissionChecker } from '@/modules/rbac/types';
import { BaseController } from '@/modules/restful/base.controller';

import { Crud } from '@/modules/restful/decorators';

import { QueryMessageDto } from '../../dtos';
import { MessageEntity } from '../../entities/message.entity';
import { MessageService } from '../../services';

const permissions: PermissionChecker[] = [
    async (ab) => ab.can(PermissionAction.MANAGE, MessageEntity.name),
];

@Crud({
    id: 'message',
    enabled: [
        { name: 'list', option: simpleCurdOption(permissions, '消息查询,以分页模式展示') },
        { name: 'detail', option: simpleCurdOption(permissions, '消息详情') },
        {
            name: 'delete',
            option: simpleCurdOption(permissions, '删除消息,支持批量删除'),
        },
    ],
    dtos: {
        list: QueryMessageDto,
    },
})
@Controller('manage/messages')
export class MessageManageController extends BaseController<MessageService> {
    constructor(protected messageService: MessageService) {
        super(messageService);
    }
}
