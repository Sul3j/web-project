import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class MoviesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    filename: string;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column()
    description: string;
}