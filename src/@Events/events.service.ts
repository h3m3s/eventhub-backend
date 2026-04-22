import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from 'src/entities/event.entities';
import { EventRegistration, RegistrationStatus } from 'src/entities/reservations.entities';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventRegistration)
    private readonly registrationRepository: Repository<EventRegistration>,
  ) {}

  async findAll(){
    const events = await this.eventRepository.find({
      relations: ['registrations'],
    });
    return this.enrichWithAvailability(events);
  }

  async findOne(id: number){
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['registrations'],
    });
    if (!event) return null;
    return this.enrichWithAvailability([event])[0];
  }

  private enrichWithAvailability(events: Event[]) {
    return events.map((event) => {
      const registered = event.registrations?.filter(
        (r) => r.status === RegistrationStatus.REGISTERED
      ).length || 0;
      const available = Math.max(0, (event.limit || 0) - registered);
      const occupancyPercent = event.limit
        ? Math.round((registered / event.limit) * 100)
        : 0;

      return {
        ...event,
        available,
        occupancyPercent,
        registered,
      };
    });
  }

  async search(query?: string): Promise<any[]> {
    const qb = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.registrations', 'registrations');

    if (!this.hasQuery(query)) {
      const events = await this.getDefaultList(qb);
      return this.enrichWithAvailability(events);
    }

    const terms = this.normalizeQuery(query!);

    this.applySearch(qb, terms);

    const events = await qb
      .orderBy('event.dateStart', 'DESC')
      .limit(50)
      .getMany();

    return this.enrichWithAvailability(events);
  }

  private applySearch(qb, terms: string[]) {
  const fields: (keyof Event)[] = [
    'name',
    'description',
    'location',
    'adress',
    'category',
  ];

  terms.forEach((term, index) => {
    const param = { [`t${index}`]: `%${term}%` };

    const orConditions = fields.map(
      (field) => `LOWER(event.${field}) LIKE :t${index}`
    );

    const condition = `(${orConditions.join(' OR ')})`;

    if (index === 0) {
      qb.where(condition, param);
    } else {
      qb.andWhere(condition, param);
    }
  });
}

  private hasQuery(query?: string): boolean {
    return !!query?.trim();
  }

  private normalizeQuery(query: string): string[] {
    return query
      .trim()
      .toLowerCase()
      .split(' ')
      .filter(Boolean);
  }

  private getDefaultList(qb: SelectQueryBuilder<Event>): Promise<Event[]> {
    return qb
      .orderBy('event.dateStart', 'DESC')
      .limit(50)
      .getMany();
  }
}