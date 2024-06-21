
import { IsNotEmpty } from 'class-validator';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @ManyToOne(()=> User, user => user.bookReservations)
    user: User;

    @IsNotEmpty()
    @ManyToOne(() => Book, book => book.bookReservations)
    book: Book;

    @IsNotEmpty()
    @Column('date')
    startDate: Date;

    @IsNotEmpty()
    @Column('date')
    endDate: Date;
}
