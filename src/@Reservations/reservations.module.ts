import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Event } from 'src/entities/event.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
