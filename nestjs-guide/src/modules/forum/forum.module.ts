import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ExampleProvider } from './providers/example.provider';
import { Factory } from './providers/factory';
import { OneProvider } from './providers/one.provider';
import { AnotherProvider } from './providers/another.provider';
const exampleTest = {
  useValue: () => 'useValue提供者',
  useAlias: () => '别名提供者',
};
const example = new ExampleProvider();
@Module({
  controllers: [ForumController],
  providers: [
    ForumService,
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
})
export class ForumModule {}
