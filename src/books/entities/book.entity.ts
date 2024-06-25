import { IsNotEmpty } from 'class-validator';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  title: string;

  @Column()
  genre: string;

  @Column('text') 
  description: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  pages: number;

  @Column('text')
  image_url: string;

  @OneToMany(() => Reservation, bookReservation => bookReservation.book)
  bookReservations: Reservation[];
}