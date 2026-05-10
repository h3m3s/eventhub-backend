import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ReservationsModule } from 'src/@Reservations/reservations.module';
import { Event } from 'src/entities/event.entities';
import { EventRegistration } from 'src/entities/reservations.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventRegistration]),
    ReservationsModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
