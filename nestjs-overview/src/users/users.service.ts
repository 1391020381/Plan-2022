import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository,DeleteResult } from 'typeorm';
import { InjectRepository,} from '@nestjs/typeorm'
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>){}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll():Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number):Promise<User>{
    return this.usersRepository.findOne({where:{id}})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string):Promise<DeleteResult> {
    return this.usersRepository.delete(id)
  }
}
