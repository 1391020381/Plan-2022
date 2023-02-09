import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ConfigModule} from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User} from './users/entities/user.entity'
import { UsersHttpModule } from './users-http/users-http.module';
@Module({
  imports: [TypeOrmModule.forRoot({
    type:"mysql",
    host:"localhost",
    port:3306,
    username:"root",
    password:"171226q2",
    database:"demo",
    entities:[User],
    synchronize:true
  }),ConfigModule.forRoot({
    isGlobal:true,
    // envFilePath:['.env.dev','.env.test','env.prod']
  }),CatsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
