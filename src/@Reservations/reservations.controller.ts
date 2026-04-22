import { Controller, Post, Delete, Get, Param, Body, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async createReservation(@Body() body: { eventId: number; userId: number }) {
    return this.reservationsService.createReservation(
      body.eventId,
      body.userId
    );
  }

  @Delete(':eventId/:userId')
  async cancelReservation(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.reservationsService.cancelReservation(
      parseInt(eventId),
      parseInt(userId)
    );
  }

  @Get('stats/:eventId')
  async getEventStats(@Param('eventId') eventId: string) {
    return this.reservationsService.getEventStats(parseInt(eventId));
  }
}
