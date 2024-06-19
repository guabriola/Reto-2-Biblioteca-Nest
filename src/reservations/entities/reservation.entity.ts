
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User, user => user.bookReservations)
    user: User;

    @ManyToOne(() => Book, book => book.bookReservations)
    book: Book;

    @Column('date')
    startDate: Date;

    @Column('date')
    endDate: Date;
}
