import { Controller, Get, Inject } from '@nestjs/common';

import { CircularFirstProvider } from '../providers/circular-first.provider';

import { ExampleProvider } from '../providers/example.provider';
import { Factory } from '../providers/factory';
import { OneProvider } from '../providers/one.provider';

@Controller('examples')
export class ExampleController {
    constructor(
        private valExp: ExampleProvider,
        @Inject('ID-EXAMPLE') private idExp: ExampleProvider,
        @Inject('FACTORY-EXAMPLE') private ftExp: Factory,
        @Inject('ALIAS-EXAMPLE') private asExp: ExampleProvider,
        @Inject('ASYNC-EXAMPLE') private acExp: OneProvider,
        private circular: CircularFirstProvider,
    ) {}

    @Get('value')
    async useValue() {
        return this.valExp.useValue();
    }

    @Get('id')
    async useId() {
        return this.idExp.useId();
    }

    @Get('factory')
    async useFactory() {
        return this.ftExp.getContent();
    }

    @Get('alias')
    async useAlias() {
        return this.asExp.useAlias();
    }

    @Get('async')
    async useAsync() {
        return this.acExp.useAsync();
    }

    @Get('circular')
    async useCircular() {
        return this.circular.first();
    }
}
