import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { IsOptional, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { IsModelExist } from '@/modules/database/constraints';
import { ListQueryDto } from '@/modules/restful/dtos';

import { RoleEntity } from '../entities';

@DtoValidation({ type: 'query' })
export class QueryPermssionDto extends OmitType(ListQueryDto, ['trashed']) {
    @ApiPropertyOptional({
        description: '角色ID:通过角色过滤权限列表',
    })
    @IsModelExist(RoleEntity, {
        groups: ['update'],
        message: '指定的角色不存在',
    })
    @IsUUID(undefined, { message: '角色ID格式错误' })
    @IsOptional()
    role?: string;
}
