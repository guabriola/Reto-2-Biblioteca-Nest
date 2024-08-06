import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { BooksService } from 'src/books/books.service';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Reservation, Book])], //It's needed to use those repositories on user services. 
  controllers: [UsersController],
  providers: [UsersService, RolesService, ReservationsService, BooksService],
  exports: [UsersService],//Makes init.Service works 
})
export class UsersModule {}
