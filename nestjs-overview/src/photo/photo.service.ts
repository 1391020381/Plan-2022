import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Repository,DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import {PhotoMetadata} from './entities/photoMetadata.entity'
@Injectable()
export class PhotoService {
  constructor(@InjectRepository(Photo) private photoRepository: Repository<Photo>, 
  @InjectRepository(PhotoMetadata)
  private readonly PhotoMetaRepository: Repository<PhotoMetadata>){}
  create(createPhotoDto: CreatePhotoDto) {
    return 'This action adds a new photo';
  }

  findAll() {
    return `This action returns all photo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photo`;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto) {
    return `This action updates a #${id} photo`;
  }

  remove(id: number) {
    return `This action removes a #${id} photo`;
  }
}
