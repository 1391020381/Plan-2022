import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';

import { CascadeCategory } from './CascadeCategory';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    text: string;

    @ManyToMany(() => CascadeCategory, (category) => category.questions, {
        cascade: true,
    })
    @JoinTable()
    categories: CascadeCategory[];
}
