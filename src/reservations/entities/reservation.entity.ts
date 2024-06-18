import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bookId: string;

    @Column()
    userId: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;
}
