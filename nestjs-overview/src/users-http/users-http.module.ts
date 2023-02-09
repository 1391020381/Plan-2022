import { Module } from '@nestjs/common';
import { UsersHttpService } from './users-http.service';
import { UsersHttpController } from './users-http.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
@Module({
  imports:[UsersModule],
  controllers: [UsersModule,UsersHttpController],
  providers: [UsersService,UsersHttpService],
  
})
export class UsersHttpModule {}
