import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis';
import { isNil } from 'lodash';

import { RedisOption } from '@/helpers/types';

@Injectable()
export class RedisService {
    protected options: Array<RedisOption>;

    protected clients: Map<string, RedisType> = new Map();

    constructor(options: Array<RedisOption>) {
        this.options = options;
    }

    async createClients() {
        this.options.map(async (o) => {
            this.clients.set(o.name, new Redis(o));
        });
    }

    getClient(name?: string): Redis {
        let key = 'default';
        if (!isNil(name)) key = name;
        if (!this.clients.has(key)) {
            throw new Error(`client ${key} does not exist`);
        }
        return this.clients.get(key);
    }

    getClients(): Map<string, Redis> {
        return this.clients;
    }
}
