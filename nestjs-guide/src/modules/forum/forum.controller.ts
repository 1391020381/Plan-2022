import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './types';
import { isNil } from 'lodash';
import { ExampleProvider } from './providers/example.provider';
import { Factory } from './providers/factory';
import { OneProvider } from './providers/one.provider';
let posts: PostEntity[] = [
  { title: '第一篇文章标题', body: '第一篇文章内容' },
  { title: '第二篇文章标题', body: '第二篇文章内容' },
  { title: '第三篇文章标题', body: '第三篇文章内容' },
  { title: '第四篇文章标题', body: '第四篇文章内容' },
  { title: '第五篇文章标题', body: '第五篇文章内容' },
  { title: '第六篇文章标题', body: '第六篇文章内容' },
].map((v, id) => ({ ...v, id }));
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  create(
    @Body(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        groups: ['create'],
      }),
    )
    data: CreatePostDto,
  ) {
    // return this.forumService.create(createForumDto);
    const newPost: PostEntity = {
      id: Math.max(...posts.map(({ id }) => id + 1)),
      title: '新增文章标题',
      body: '新增文章内容',
    };
    posts.push(newPost);
    return newPost;
  }
  @Get()
  findAll() {
    return this.forumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    //return this.forumService.findOne(+id);
    const post = posts.find((item) => item.id === Number(id));
    if (isNil(post)) {
      throw new NotFoundException(`the post with id ${id} not exits`);
    }
    return post;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        groups: ['update'],
      }),
    )
    data: UpdatePostDto,
  ) {
    // return this.forumService.update(+id, updateForumDto);
    let toUpdate = posts.find((item) => item.id === Number(id));
    if (isNil(toUpdate)) {
      throw new NotFoundException(`the post with id ${id} not exits`);
      toUpdate = { ...toUpdate, title: '修改一篇文章的标题' };
      posts = posts.map((item) => (item.id === Number(id) ? toUpdate : item));
      return toUpdate;
    }
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    // return this.forumService.remove(+id);
    const toDelete = posts.find((item) => item.id === Number(id));
    if (isNil(toDelete))
      throw new NotFoundException(`the post width id ${id} not exits`);
    posts = posts.filter((item) => item.id !== Number(id));
    return toDelete;
  }
}
