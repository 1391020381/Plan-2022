import { Controller, Get, Post, Body, Patch, Param, Delete,Redirect,Query,HttpException,HttpStatus, UseFilters,UsePipes, UseInterceptors } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import {HttpExceptionFilter} from '../../common/http-exception.filter'
import { JoiValidationPipe} from '../../common/Joi-validation.pipe'
import {LoggingInterceptor} from '../../common/logging.interceptor'
import { ConfigService} from '@nestjs/config'
@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private readonly catsService: CatsService,private configService:ConfigService) {}

  @Post()
  // @UsePipes(new JoiValidationPipe())
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  findAll() {
    const dbUser = this.configService.get<string>('DATABASE_USER')
    const dbPassword = this.configService.get<string>('DATABASE_PASSWORD')
    console.log('dbUser:',dbUser,process.env.NODE_ENV,'dbPassword:',dbPassword)
    return this.catsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.catsService.findOne(+id);
  // }
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    console.log('docs:',version)
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(+id);
  }
}
