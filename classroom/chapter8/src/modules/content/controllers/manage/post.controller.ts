import { Body, Controller, Post } from '@nestjs/common';

import { isNil } from 'lodash';

import { BaseController } from '@/modules/core/crud';

import { ClassToPlain } from '@/modules/core/types';
import { PermissionAction } from '@/modules/rbac/constants';

import { Permission, RbacCrud } from '@/modules/rbac/decorators';
import { RbacCurdOption } from '@/modules/rbac/types';

import { ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { QueryPostDto } from '../../dtos';
import { ManageUpdatePostDto, ManageCreatePostDto } from '../../dtos/manage';
import { PostEntity } from '../../entities';
import { PostService } from '../../services';

const option: RbacCurdOption = {
    rbac: [async (ab) => ab.can(PermissionAction.MANAGE, PostEntity.name)],
};
/**
 * 文章控制器
 */
@RbacCrud({
    id: 'post',
    enabled: [
        { name: 'list', option },
        { name: 'detail', option },
        'store',
        { name: 'update', option },
        { name: 'delete', option },
        { name: 'restore', option },
        { name: 'deleteMulti', option },
        { name: 'restoreMulti', option },
    ],
    dtos: {
        query: QueryPostDto,
        create: ManageCreatePostDto,
        update: ManageUpdatePostDto,
    },
})
@Controller('manage/content/posts')
export class PostManageController extends BaseController<PostService> {
    constructor(protected postService: PostService) {
        super(postService);
    }

    @Post()
    @Permission(option.rbac[0])
    async store(
        @Body() data: ManageCreatePostDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<PostEntity> {
        const author = isNil(data.author)
            ? user
            : ({ id: data.author } as ClassToPlain<UserEntity>);
        return this.service.create({ ...data, author: author.id });
    }
}
