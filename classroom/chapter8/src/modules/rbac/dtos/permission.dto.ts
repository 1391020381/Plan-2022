import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

import { tNumber } from '@/helpers';
import { PaginateDto } from '@/helpers/types';
import { QueryTrashMode } from '@/modules/core/constants';
import { IsModelExist } from '@/modules/core/constraints';
import { TrashedDto } from '@/modules/core/types';

import { RoleEntity } from '../entities';

export class QueryPermssionDto implements PaginateDto, TrashedDto {
    @IsModelExist(RoleEntity, {
        groups: ['update'],
        message: '指定的角色不存在',
    })
    @IsUUID(undefined, { message: '角色ID格式错误' })
    @IsOptional()
    role?: string;

    @IsEnum(QueryTrashMode)
    @IsOptional()
    trashed?: QueryTrashMode;

    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => tNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;
}
