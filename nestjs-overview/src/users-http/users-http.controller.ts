import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersHttpService } from './users-http.service';
import { CreateUsersHttpDto } from './dto/create-users-http.dto';
import { UpdateUsersHttpDto } from './dto/update-users-http.dto';

@Controller('users-http')
export class UsersHttpController {
  constructor(private readonly usersHttpService: UsersHttpService) {}

  @Post()
  create(@Body() createUsersHttpDto: CreateUsersHttpDto) {
    return this.usersHttpService.create(createUsersHttpDto);
  }

  @Get()
  findAll() {
    return this.usersHttpService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersHttpService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersHttpDto: UpdateUsersHttpDto) {
    return this.usersHttpService.update(+id, updateUsersHttpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersHttpService.remove(+id);
  }
}
