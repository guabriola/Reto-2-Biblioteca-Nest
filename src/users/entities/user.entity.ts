import { Exclude } from 'class-transformer';
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
  //@Exclude() //I don't want to send the password in the response that is why I - If I do this throws error "password can't be empty when i want to create new user"
  password: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @OneToMany(() => Reservation, bookReservation => bookReservation.user)
  bookReservations: Reservation[];
}
