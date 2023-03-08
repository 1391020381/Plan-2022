import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Photo } from './Photo';

@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    // Author contains an inverse side of a relation 。
    // OneToMany is always an inverse side of the relation , and it can't exist widthout ManyToOne on the other side of the relation.

    @OneToMany(() => Photo, (photo) => photo.author)
    photos: Photo[];
}
