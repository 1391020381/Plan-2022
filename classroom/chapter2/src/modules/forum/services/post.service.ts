import { Injectable, NotFoundException } from '@nestjs/common';
import { isNil } from 'lodash';

import { CommonService } from '@/modules/core/services/common.service';

import { UserService } from '@/modules/user/services/user.service';

import { CreatePostDto, UpdatePostDto } from '../dtos';

import { PostEntity } from '../types';

let posts: PostEntity[] = [
    { title: '第一篇文章标题', body: '第一篇文章内容' },
    { title: '第二篇文章标题', body: '第二篇文章内容' },
    { title: '第三篇文章标题', body: '第三篇文章内容' },
    { title: '第四篇文章标题', body: '第四篇文章内容' },
    { title: '第五篇文章标题', body: '第五篇文章内容' },
    { title: '第六篇文章标题', body: '第六篇文章内容' },
].map((v, id) => ({ ...v, id }));

@Injectable()
export class PostService {
    protected ccc = 1;

    constructor(
        private userService: UserService,
        private commonService: CommonService,
    ) {}

    async getGlobalValue() {
        return this.commonService.getGlobalValue();
    }

    async getPostUsers() {
        return this.userService.getUsers();
    }

    async findAll() {
        this.userService.findAll();
        // this.ccc++;
        // console.log(this.ccc);
        return posts;
    }

    async findOne(id: number) {
        const post = posts.find((item) => item.id === id);
        if (isNil(post))
            throw new NotFoundException(`the post with id ${id} not exits!`);
        return post;
    }

    async create(data: CreatePostDto) {
        const newPost: PostEntity = {
            id: Math.max(...posts.map(({ id }) => id)) + 1,
            ...data,
        };
        posts.push(newPost);
        return newPost;
    }

    async update(data: UpdatePostDto) {
        let toUpdate = posts.find((item) => item.id === data.id);
        if (isNil(toUpdate))
            throw new NotFoundException(
                `the post with id ${data.id} not exits!`,
            );
        toUpdate = { ...toUpdate, ...data };
        posts = posts.map((item) => (item.id === data.id ? toUpdate : item));
        return toUpdate;
    }

    async delete(id: number) {
        const toDelete = posts.find((item) => item.id === id);
        if (isNil(toDelete))
            throw new NotFoundException(`the post with id ${id} not exits!`);
        posts = posts.filter((item) => item.id !== id);
        return toDelete;
    }
}
