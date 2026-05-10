import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from 'src/@Auth/jwt-auth.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReservation(@Body() body: any, @Request() req: any) {
    const eventId = body.eventId || body.event_id;
    return this.reservationsService.createReservation(
      eventId,
      req.user.id,
    );
  }

  @Get('stats/:eventId')
  async getEventStats(@Param('eventId') eventId: number) {
    return this.reservationsService.getEventStats(eventId);
  }
  @Put('cancel/:eventId')
  @UseGuards(JwtAuthGuard)
  async cancelReservation(@Param('eventId') eventId: number, @Request() req: any,) {
    return this.reservationsService.cancelReservation(
      eventId,
      req.user.id,
    );
  }

  @Get('my-reservations')
  @UseGuards(JwtAuthGuard)
  async getMyReservations(@Request() req: any) {
    return this.reservationsService.getUserReservations(req.user.id);
  }
}
