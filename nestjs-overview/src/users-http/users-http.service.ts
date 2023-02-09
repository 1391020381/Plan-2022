import { Injectable } from '@nestjs/common';
import { CreateUsersHttpDto } from './dto/create-users-http.dto';
import { UpdateUsersHttpDto } from './dto/update-users-http.dto';
import { Repository,DeleteResult } from 'typeorm';
import { InjectRepository,} from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity';
@Injectable()
export class UsersHttpService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>){}
  create(createUsersHttpDto: CreateUsersHttpDto) {
    return 'This action adds a new usersHttp';
  }


  findAll():Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} usersHttp`;
  }

  update(id: number, updateUsersHttpDto: UpdateUsersHttpDto) {
    return `This action updates a #${id} usersHttp`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersHttp`;
  }
}
