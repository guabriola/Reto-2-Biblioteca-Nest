import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reservation {
    /**
    * Autogenerated.
    */
    @PrimaryGeneratedColumn()
    id: number;

    /**
    * Array of Users
    */
    @ManyToOne(()=> User, user => user.bookReservations,  { onDelete: 'CASCADE' })
    user: User;

    /**
    * Array of Books
    */
    @ManyToOne(() => Book, book => book.bookReservations, { onDelete: 'CASCADE' })
    book: Book;

    /**
    * Booking start day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @Column('date')
    startDate: Date;

    /**
    * Booking end day
    * Date format --> YY/MM/DD
    * @example 2024-06-01
    */
    @Column('date')
    endDate: Date;
}
