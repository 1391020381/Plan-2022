import { MultipartFile } from '@fastify/multipart';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { IsFile } from '../constraints';

@DtoValidation()
export class UploadFileDto {
    @ApiProperty({ type: 'string', format: 'binary', description: '品牌,联盟,商品等logo和封面图' })
    @IsFile({
        mimetypes: ['image/png', 'image/gif', 'image/jpeg', 'image/webp', 'image/svg+xml'],
        fileSize: 1024 * 1024 * 5,
    })
    @IsDefined({ groups: ['create'], message: 'image cannot be empty' })
    @IsOptional({ groups: ['update'] })
    image: MultipartFile;
}
