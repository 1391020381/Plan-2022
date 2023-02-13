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
  private readonly photoMetaRepository: Repository<PhotoMetadata>){}
  create(createPhotoDto: CreatePhotoDto) {
    let photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.views = 1;
    photo.isPublished = true

    // let metadata = new PhotoMetadata()
    // metadata.height = 640;
    // metadata.width = 480;
    // metadata.compressed = true;
    // metadata.comment = 'cybershoot';
    // metadata.orientation = 'portait';
    // metadata.photo = photo
  return this.photoRepository.save(photo)
  // return  this.photoMetaRepository.save(metadata)
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
