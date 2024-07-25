import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { CustomDateRangeValidator } from 'src/common/validators/customDateVaildators';


@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Book])],
  controllers: [ReservationsController],
  providers: [ReservationsService, CustomDateRangeValidator],
})
export class ReservationsModule {}
