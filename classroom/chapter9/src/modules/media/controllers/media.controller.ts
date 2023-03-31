import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';

import { FastifyReply } from 'fastify';

import { NotEmptyPipe } from '@/modules/core/pipes';

import { Guest } from '@/modules/user/decorators';

import { MediaService } from '../services';

@Controller('medias')
export class MediaController {
    constructor(protected service: MediaService) {}

    @Get('images/:id.:ext')
    @Guest()
    image(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('ext', new NotEmptyPipe({ maxLength: 10 })) ext: string,
        @Res({ passthrough: true }) res: FastifyReply,
    ) {
        return this.service.loadImage(id, res, `.${ext}`);
    }
}
