import { Controller, Get, Post, Body, Patch, Param, Delete,Redirect,Query,HttpException,HttpStatus, UseFilters,UsePipes } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import {HttpExceptionFilter} from '../../common/http-exception.filter'
import { JoiValidationPipe} from '../../common/Joi-validation.pipe'
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  // @UsePipes(new JoiValidationPipe())
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  findAll() {
   // return this.catsService.findAll();
   throw new HttpException({
    status:HttpStatus.FORBIDDEN,
    error:'This is a custom message-------xxxxxxxxxxx',
   },HttpStatus.FORBIDDEN)
  // console.log(window)
  // return {UseFilters:'UseFilters'}
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
