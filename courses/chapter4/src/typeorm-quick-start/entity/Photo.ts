import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, ManyToMany } from 'typeorm';

import { PhotoMetadata } from './PhotoMetadata';

import { Author } from './Author';

import { Album } from './Album';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    name: string;

    @Column('text')
    description: string;

    @Column()
    filename: string;

    @Column('double')
    views: number;

    @Column()
    isPublished: boolean;

    @OneToOne((type) => PhotoMetadata, (photoMetadata) => photoMetadata.photo, { cascade: true })
    metadata: PhotoMetadata;

    // in many-to-one / one-to/many relation, the owner side is always many-to-one .
    // it means that the class that uses @ManyToOne will store the id of the related object

    @ManyToOne(() => Author, (author) => author.photos)
    author: Author;

    @ManyToMany(() => Album, (album) => album.photos)
    albums: Album[];
}
