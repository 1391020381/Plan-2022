import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { FastifyReply } from 'fastify';

import { NotEmptyPipe } from '@/modules/core/pipes';

import { Depends } from '@/modules/restful/decorators/depends.decorator';

import { Guest } from '@/modules/user/decorators';

import { MediaModule } from '../media.module';
import { MediaService } from '../services';

@ApiTags('文件操作')
@Depends(MediaModule)
@Controller('medias')
export class MediaController {
    constructor(protected service: MediaService) {}

    @Get('images/:id.:ext')
    @ApiOperation({ summary: '获取图片' })
    @Guest()
    image(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('ext', new NotEmptyPipe({ maxLength: 10 })) ext: string,
        @Res({ passthrough: true }) res: FastifyReply,
    ) {
        return this.service.loadImage(id, res, `.${ext}`);
    }
}
