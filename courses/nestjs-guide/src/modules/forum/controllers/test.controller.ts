import { Controller, Get } from '@nestjs/common';

import { UserService } from '../../user/services/user.service';
import { PostService } from '../services/post.service';

@Controller('tests')
export class TestController {
    constructor(
        protected postService: PostService,
        private userService: UserService,
    ) {}

    @Get()
    find() {
        this.userService.findAll();
        return this.postService.findAll();
    }
}
