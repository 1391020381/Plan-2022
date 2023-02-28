import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

@Injectable()
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNumber(undefined, { groups: ['update'], message: '帖子ID格式错误' })
  @IsDefined({ groups: ['update'], message: '帖子ID必须指定' })
  id!: number;
}
