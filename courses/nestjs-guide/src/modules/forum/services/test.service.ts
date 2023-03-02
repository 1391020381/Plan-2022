import { Injectable } from '@nestjs/common';

import { PostService } from './post.service';

@Injectable()
export class TestService {
    constructor(private postService: PostService) {}

    async addCcc() {
        await this.postService.findAll();
    }
}
