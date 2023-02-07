import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ConfigModule} from '@nestjs/config'
@Module({
  imports: [CatsModule,ConfigModule.forRoot({
    isGlobal:true,
    // envFilePath:['.env.dev','.env.test','env.prod']
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
