import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { SearchEventsDto } from 'src/dto/search-events.dto';
import { Query } from '@nestjs/common';
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(){
    return this.eventsService.findAll();
  }
  @Get('id/:id')
  findOne(@Param('id') id: number){
    return this.eventsService.findOne(id);
  }
  @Get('search')
  search(@Query() query: SearchEventsDto) {
    return this.eventsService.search(query.q);
}
}
