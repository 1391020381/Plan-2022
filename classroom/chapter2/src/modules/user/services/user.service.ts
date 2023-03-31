import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
    protected aaa = 1;

    async findAll() {
        this.aaa++;
        console.log(this.aaa);
        return ['pincman'];
    }

    async getUsers() {
        return ['pincman'];
    }
}
