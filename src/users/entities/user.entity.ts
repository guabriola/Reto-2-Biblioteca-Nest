import { IsEmail, IsNotEmpty } from 'class-validator';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  username: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @OneToMany(() => Reservation, bookReservation => bookReservation.user)
  bookReservations: Reservation[];
}