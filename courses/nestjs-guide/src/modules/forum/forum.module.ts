import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { ExampleController } from './controllers/example.controller';

import { PostController } from './controllers/post.controller';
import { TestController } from './controllers/test.controller';
import { AnotherProvider } from './providers/another.provider';
import { CircularFirstProvider } from './providers/circular-first.provider';
import { CircularSecondProvider } from './providers/circular-second.provider';
import { ExampleProvider } from './providers/example.provider';
import { Factory } from './providers/factory';
import { OneProvider } from './providers/one.provider';
import { PostService } from './services/post.service';

const exampleTest = {
    useValue: () => 'useValue提供者',
    useAlias: () => '别名提供者',
};
const example = new ExampleProvider();
@Module({
    imports: [UserModule],
    controllers: [PostController, TestController, ExampleController],
    providers: [
        PostService,
        CircularFirstProvider,
        CircularSecondProvider,
        {
            provide: ExampleProvider,
            useValue: exampleTest,
        },
        {
            provide: 'ID-EXAMPLE',
            useValue: example,
        },
        {
            provide: OneProvider,
            useClass: AnotherProvider,
        },
        {
            provide: 'FACTORY-EXAMPLE',
            useFactory(one: OneProvider) {
                const factory = new Factory(one);
                return factory;
            },
            inject: [OneProvider],
        },
        {
            provide: 'ALIAS-EXAMPLE',
            useExisting: ExampleProvider,
        },
        {
            provide: 'ASYNC-EXAMPLE',
            useFactory: async () => {
                const factory = new Factory(new OneProvider());
                return factory.getPromise();
            },
        },
    ],
    exports: [PostService],
})
export class ForumModule {}
