import { AppDataSource } from './config/database.config';

import { Photo } from './entity/Photo';
import { PhotoMetadata } from './entity/PhotoMetadata';
import { Album } from './entity/Album';

const photOperate = async () => {
    // create a few albums
    const album1 = new Album();
    album1.name = 'Bears';
    await AppDataSource.manager.save(album1);

    const album2 = new Album();
    album2.name = 'Me';
    await AppDataSource.manager.save(album2);

    // create photo object
    const photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.views = 1;
    photo.isPublished = true;
    photo.albums = [album1, album2];
    // create photo metadata object
    const metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = 'cybershoot';
    metadata.orientation = 'portrait';
    // metadata.photo = photo;
    photo.metadata = metadata; // this way we connect them

    // get repository
    const photoRepository = AppDataSource.getRepository(Photo);

    // saving a photo also save the metadata
    await photoRepository.save(photo);
    const photos = await photoRepository.find({
        relations: {
            metadata: true,
            albums: true,
        },
    });
    const photosMetaDataRepository = AppDataSource.getRepository(PhotoMetadata);
    const photosMeta = await photosMetaDataRepository.find({
        relations: {
            photo: true,
        },
    });
    console.log('关联存储与关联查询:', photosMeta);
    console.log('关联存储查询与关联查询:', photos);
};

export { photOperate };
