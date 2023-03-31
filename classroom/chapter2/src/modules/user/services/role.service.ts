import { Injectable } from '@nestjs/common';

import { UserService } from './user.service';

@Injectable()
export class RoleService {
    constructor(protected userService: UserService) {}

    getUsers() {
        return this.userService.getUsers();
    }
}
