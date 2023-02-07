import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
// import { ConfigModule} from '@nestjs/config'
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  // imports:[ConfigModule]
})
export class CatsModule {}
