import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@Injectable()
export class CreatePostDto {
    @MaxLength(255, {
        always: true,
        message: '帖子标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '帖子标题必须填写' })
    @IsOptional({ groups: ['update'] })
    title!: string;

    @IsNotEmpty({ groups: ['create'], message: '帖子内容必须填写' })
    @IsOptional({ groups: ['update'] })
    body!: string;

    @MaxLength(500, {
        always: true,
        message: '帖子描述长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    summary?: string;
}
