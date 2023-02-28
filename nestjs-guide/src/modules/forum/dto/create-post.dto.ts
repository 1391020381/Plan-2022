import { Injectable } from '@nestjs/common';
import { MaxLength, IsNotEmpty, IsOptional } from 'class-validator';
@Injectable()
export class CreatePostDto {
  @MaxLength(255, {
    always: true,
    message: '帖子标题长度最大为$constraint1',
  })
  @IsNotEmpty({ groups: ['create'], message: '帖子标题必须填写' })
  @IsOptional({ groups: ['update'] })
  title!: string;
  @MaxLength(500, {
    always: true,
    message: '帖子描述长度最大为$constraint1',
  })
  @IsOptional({ always: true })
  summary?: string;
}
