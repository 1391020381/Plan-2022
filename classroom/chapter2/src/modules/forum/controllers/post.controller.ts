import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common';

import { UserService } from '../../user/services/user.service';
import { CreatePostDto, UpdatePostDto } from '../dtos';
import { PostService } from '../services/post.service';

@Controller('posts')
export class PostController {
    constructor(
        private postService: PostService,
        protected userService: UserService,
    ) {}

    @Get('common')
    async common() {
        return this.postService.getGlobalValue();
    }

    @Get('users')
    async users() {
        return this.postService.getPostUsers();
    }

    @Get()
    async index() {
        this.userService.findAll();
        return this.postService.findAll();
    }

    @Get(':id')
    async show(@Param('id', new ParseIntPipe()) id: number) {
        return this.postService.findOne(id);
    }

    @Post()
    async store(
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
        return this.postService.create(data);
    }

    @Patch()
    async update(
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
        return this.postService.update(data);
    }

    @Delete(':id')
    async delete(@Param('id', new ParseIntPipe()) id: number) {
        return this.postService.delete(id);
    }
}
