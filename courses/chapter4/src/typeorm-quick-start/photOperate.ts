import { AppDataSource } from './config/database.config';

import { Photo } from './entity/Photo';
import { PhotoMetadata } from './entity/PhotoMetadata';

const photOperate = async () => {
    // create a photo
    const photo = new Photo();
    photo.name = 'Me and Bears';
    photo.description = 'I am near polar bears';
    photo.filename = 'photo-with-bears.jpg';
    photo.views = 1;
    photo.isPublished = true;

    // create a photo metadata
    const metadata = new PhotoMetadata();
    metadata.height = 640;
    metadata.width = 480;
    metadata.compressed = true;
    metadata.comment = 'cybershoot';
    metadata.orientation = 'portrait';
    metadata.photo = photo; // this way we connect them
    // get entity repositories
    const photoRepository = AppDataSource.getRepository(Photo);
    const metadataRepository = AppDataSource.getRepository(PhotoMetadata);
    // console.log('metadataRepository:', metadataRepository);
    // first we should save a photo
    await photoRepository.save(photo);

    // photo is saved. Now we need to save a photo metadata
    await metadataRepository.save(metadata);
    const photos = await photoRepository.find({ relations: ['metadata'] });
    console.log('photos:', photos);
    // done
    console.log(
        'Metadata is saved, and the relation between metadata and photo is created in the database too',
    );
};

export { photOperate };
