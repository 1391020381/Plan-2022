import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { isNil } from 'lodash';

import { RedisConfig } from '../types';

/**
 * Redis服务
 */
@Injectable()
export class RedisService {
    /**
     * Redis配置
     */
    protected options: RedisConfig;

    /**
     * 客户端连接
     */
    protected clients: Map<string, Redis> = new Map();

    constructor(options: RedisConfig) {
        this.options = options;
    }

    getOptions() {
        return this.options;
    }

    /**
     * 通过配置创建所有连接
     */
    async createClients() {
        this.options.map(async (o) => {
            this.clients.set(o.name, new Redis(o));
        });
    }

    /**
     * 获取一个客户端连接
     * @param name 连接名称,默认default
     */
    getClient(name?: string): Redis {
        let key = 'default';
        if (!isNil(name)) key = name;
        if (!this.clients.has(key)) {
            throw new Error(`client ${key} does not exist`);
        }
        return this.clients.get(key);
    }

    /**
     * 获取所有客户端连接
     */
    getClients(): Map<string, Redis> {
        return this.clients;
    }
}
