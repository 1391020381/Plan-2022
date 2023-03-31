import { Body, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { DeleteDto, ListQueryDto, RestoreDto } from './dtos';
import { DetailQueryDto } from './dtos/detail-query.dto';

/**
 * 分类控制器
 */
export abstract class BaseController<S> {
    protected service: S;

    constructor(service: S) {
        this.setService(service);
    }

    private setService(service: S) {
        this.service = service;
    }

    async list(@Query() options: ListQueryDto, ...args: any[]) {
        return (this.service as any).paginate(options);
    }

    async detail(
        @Query() { trashed }: DetailQueryDto,
        @Param('item', new ParseUUIDPipe())
        item: string,
        ...args: any[]
    ) {
        return (this.service as any).detail(item, trashed);
    }

    async store(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).create(data);
    }

    async update(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).update(data);
    }

    async delete(
        @Body()
        { items, trash }: DeleteDto,
        ...args: any[]
    ) {
        return (this.service as any).delete(items, trash);
    }

    async restore(
        @Body()
        { items }: RestoreDto,
        ...args: any[]
    ) {
        return (this.service as any).restore(items);
    }
}
