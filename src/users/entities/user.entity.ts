import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';



@Entity()
export class User {
  /**
  * Autogenerated.
  */
  @PrimaryGeneratedColumn()
  id: number;

  /**
  * Username must be unique.
  * @example jhondoe
  */
  @Column({ unique: true })
  username: string;

  /**
  * Email must be unique.
  * @example jhondoe@examplemail.com
  */
  @Column({ unique: true })
  email: string;

  /**
  * Password required.
  * At least 6 characters 
  * @example MyPass1234!
  */
  @Column()
  //@Exclude() //I don't want to send the password in the response that is why I - If I do this throws error "password can't be empty when i want to create new user"
  password: string;

  /**
  * Name required.
  * @example Jhon
  */
  @Column()
  name: string;

  /**
  * Lastname required.
  * @example Doe
  */
  @Column()
  lastName: string;

  /**
  * Array of Reservations
  */
  @OneToMany(() => Reservation, bookReservation => bookReservation.user)
  bookReservations: Reservation[];
}
