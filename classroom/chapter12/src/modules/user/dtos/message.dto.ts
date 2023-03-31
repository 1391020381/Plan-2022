import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { toBoolean } from '@/modules/core/helpers';
import { IsModelExist } from '@/modules/database/constraints';
import { ListQueryDto } from '@/modules/restful/dtos';

import { MessageEntity } from '../entities/message.entity';
import { UserEntity } from '../entities/user.entity';

/**
 * websocket认证请求验证
 */
@Injectable()
export class WSAuthDto {
    @IsDefined({
        message: 'Token必须填写',
    })
    token!: string;
}

/**
 * websocket发送消息请求验证
 */
export class WSMessageDto extends WSAuthDto {
    @IsOptional()
    title?: string;

    @IsNotEmpty({
        message: '消息内容必须填写',
    })
    body!: string;

    @IsUUID(undefined, {
        each: true,
        message: 'ID格式错误',
    })
    @IsDefined({
        each: true,
        message: '用户ID必须指定',
    })
    receviers: string[] = [];

    @IsOptional()
    type?: string;
}

/**
 * 接收者更新信息状态的请求验证
 */
@DtoValidation()
export class UpdateReceviesDto {
    @ApiProperty({
        description: '消息ID列表:接收者更新信息状态的消息列表',
        type: [String],
    })
    @IsModelExist(MessageEntity, {
        each: true,
        message: '消息不存在',
    })
    @IsUUID(undefined, {
        each: true,
        message: '消息ID格式不正确',
    })
    @IsDefined({ message: '消息列表必须指定' })
    messages: string[];
}

/**
 * 自己发送的消息列表查询请求验证
 */
@DtoValidation({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryOwnerMessageDto extends OmitType(ListQueryDto, ['trashed']) {}

/**
 * 消息管理查询请求验证
 */
@Injectable()
@DtoValidation({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryMessageDto extends QueryOwnerMessageDto {
    @ApiPropertyOptional({
        description: '消息发送者ID:根据消息发送者过滤消息列表',
    })
    @IsModelExist(UserEntity, {
        message: '发送者不存在',
    })
    @IsUUID(undefined, { message: '发送者ID格式错误' })
    @IsOptional()
    sender?: string;
}

/**
 * 收到的消息查询请求验证
 */
@Injectable()
@DtoValidation({
    type: 'query',
    skipMissingProperties: true,
})
export class QueryReciveMessageDto extends QueryOwnerMessageDto {
    /**
     * @description 过滤已读状态
     * @type {boolean}
     */
    @ApiPropertyOptional({ description: '根据已读状态过滤消息列表(用户侧)' })
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    readed?: boolean;
}
