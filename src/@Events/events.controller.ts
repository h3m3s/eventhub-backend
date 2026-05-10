import { Controller, Get, Param, Post, Delete, Query, UseGuards, Request, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { SearchEventsDto } from 'src/dto/search-events.dto';
import { CreateEventDto } from 'src/dto/create-event.dto';
import { ReservationsService } from 'src/@Reservations/reservations.service';
import { JwtAuthGuard } from 'src/@Auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.eventsService.findOne(id);
  }

  @Get('search')
  search(@Query() query: SearchEventsDto) {
    return this.eventsService.search(query.q);
  }
  @Get('popular')
  findTopEvents(){
    return this.eventsService.findTopEvents();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    return this.eventsService.create(createEventDto);
  }

  @Post(':id/favorites')
  @UseGuards(JwtAuthGuard)
  async addToFavorites(
    @Param('id') eventId: string,
    @Request() req: any,
  ) {
    return this.reservationsService.addToFavorites(
      parseInt(eventId),
      req.user.id,
    );
  }

  @Delete(':id/favorites')
  @UseGuards(JwtAuthGuard)
  async removeFromFavorites(
    @Param('id') eventId: string,
    @Request() req: any,
  ) {
    return this.reservationsService.removeFromFavorites(
      parseInt(eventId),
      req.user.id,
    );
  }

  @Get('favorites/my')
  @UseGuards(JwtAuthGuard)
  async getUserFavorites(@Request() req: any) {
    return this.reservationsService.getUserFavorites(req.user.id);
  }
}
