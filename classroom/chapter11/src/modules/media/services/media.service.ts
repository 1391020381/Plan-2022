import { extname, join } from 'path';

import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { createReadStream, existsSync, removeSync } from 'fs-extra';
import { isNil } from 'lodash';
import { lookup } from 'mime-types';
import { DataSource, ObjectLiteral } from 'typeorm';

import { Configure } from '@/modules/core/configure';
import { BaseService } from '@/modules/database/base';
import { UserService } from '@/modules/user/services';

import { MediaEntity } from '../entities';
import { uploadLocalFile } from '../helpers';

import { MediaRepository } from '../repositories';
import { CreateFileOptions, UploadFileType } from '../types';

/**
 * 文件服务
 */
@Injectable()
export class MediaService extends BaseService<MediaEntity, MediaRepository> {
    constructor(
        protected configure: Configure,
        protected dataSource: DataSource,
        protected userService: UserService,
        protected repository: MediaRepository,
    ) {
        super(repository);
    }

    /**
     * 上传文件
     * @param param0
     */
    async upload<E extends ObjectLiteral>({ file, dir, relation, user }: CreateFileOptions<E>) {
        if (isNil(file)) throw new NotFoundException('Have not any file to upload!');
        const uploader: UploadFileType = {
            filename: file.filename,
            mimetype: file.mimetype,
            value: (await file.toBuffer()).toString('base64'),
        };
        const item = new MediaEntity();
        item.file = await uploadLocalFile(uploader, dir);
        if (user) {
            item.user = await this.userService.detail(user.id);
        }
        await MediaEntity.save(item);
        if (!isNil(relation)) {
            const { entity, id, multi = false } = relation;
            let field = multi ? 'images' : 'image';
            if (!isNil(relation.field)) field = relation.field;
            const relationRepo = this.dataSource.getRepository(entity);
            const relationItem = await relationRepo.findOneOrFail({
                relations: [field],
                where: { id } as any,
            });
            if (!multi) {
                const oldMedia = !isNil(relationItem[field])
                    ? join(await this.configure.get('media.upload'), relationItem[field].file)
                    : null;
                await relationRepo.update(relationItem.id, {
                    [field]: item,
                } as any);
                if (!isNil(oldMedia) && existsSync(oldMedia)) removeSync(oldMedia);
            } else {
                const medias = (relationItem[field] ?? []) as MediaEntity[];
                const removes: string[] = [];
                for (const media of medias) {
                    const filePath = join(await this.configure.get('media.upload'), media.file);
                    if (!existsSync(filePath)) removes.push(media.id);
                }

                await this.repository
                    .createQueryBuilder((entity as any).name ?? 'model')
                    .relation(entity, field)
                    .of(relationItem)
                    .addAndRemove([item.id], removes);
            }
        }
        return this.repository.findOneByOrFail({ id: item.id });
    }

    /**
     * 加载图片
     * @param id 图片ID
     * @param res http响应实例
     * @param ext 图片后缀
     */
    async loadImage(id: string, res: FastifyReply, ext?: string) {
        const media = await this.detail(id);
        const filePath = join(await this.configure.get('media.upload'), media.file);
        if (!existsSync(filePath) || (ext && extname(filePath) !== ext)) {
            throw new NotFoundException('file not exists!');
        }
        const image = createReadStream(filePath);
        res.type(lookup(filePath) as string);
        return new StreamableFile(image);
    }
}
