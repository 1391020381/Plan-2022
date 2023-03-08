import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { Photo } from './Photo';

@Entity()
export class PhotoMetadata {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    height: number;

    @Column('int')
    width: number;

    @Column()
    orientation: string;

    @Column()
    compressed: boolean;

    @Column()
    comment: string;

    @OneToOne((type) => Photo, (photo) => photo.metadata)
    @JoinColumn()
    photo: Photo;
}

// phots =>  photo.metadata is a function that returns the name of the inverse side of the relation.
// Here we show that the metadata property of the Photo class is where we store PhotoMetadata in the Photo class.
