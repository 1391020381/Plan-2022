import { Controller } from '@nestjs/common';

import { BaseController } from '@/modules/core/crud';

import { Crud } from '@/modules/core/decorators';

import { QueryMessageDto } from '../../dtos';
import { MessageService } from '../../services';

@Crud({
    id: 'message',
    enabled: ['detail', 'list', 'delete', 'deleteMulti'],
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
