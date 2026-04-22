import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ReservationsController } from 'src/@Reservations/reservations.controller';
import { ReservationsService } from 'src/@Reservations/reservations.service';
import { Event } from 'src/entities/event.entities';
import { EventRegistration } from 'src/entities/reservations.entities';
import { User } from 'src/entities/user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventRegistration, User])],
  controllers: [EventsController, ReservationsController],
  providers: [EventsService, ReservationsService],
  exports: [EventsService, ReservationsService],
})
export class EventsModule {}
