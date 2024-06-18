import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bookId: number;

    @Column()
    userId: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;
}
