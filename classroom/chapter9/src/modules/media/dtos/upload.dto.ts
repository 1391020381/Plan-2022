import { MultipartFile } from '@fastify/multipart';
import { IsDefined, IsOptional } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { IsFile } from '../constraints';

@DtoValidation()
export class UploadFileDto {
    @IsFile({
        mimetypes: ['image/png', 'image/gif', 'image/jpeg', 'image/webp', 'image/svg+xml'],
        fileSize: 1024 * 1024 * 5,
    })
    @IsDefined({ groups: ['create'], message: 'image cannot be empty' })
    @IsOptional({ groups: ['update'] })
    image: MultipartFile;
}
