import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Event } from 'src/entities/event.entities';
import { User } from 'src/entities/user.entities';
import { EventRegistration } from 'src/entities/reservations.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, EventRegistration])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
