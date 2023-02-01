import { Controller, Get,Post,Res,HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('cats')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
