import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ForumModule } from './modules/forum/forum.module';
import { ExampleModule } from './modules/example/example.module';

@Module({
  imports: [ForumModule, ExampleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
