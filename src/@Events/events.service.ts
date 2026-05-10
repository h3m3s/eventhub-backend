import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from 'src/entities/event.entities';
import {
  EventRegistration,
  RegistrationStatus,
} from 'src/entities/reservations.entities';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventRegistration)
    private readonly registrationRepository: Repository<EventRegistration>,
  ) {}

  async findAll() {
    return this.getEventsWithStats();
  }
  async findOne(id: number) {
    const result = await this.getEventsWithStats(id);
    return result[0] ?? null;
  }
  async findTopEvents() {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      // Mapujemy relację registrations
      .leftJoin('event.registrations', 'registration')
      // Wybieramy pola i liczymy tylko zarezerwowane statusy
      .addSelect(
        `COUNT(CASE WHEN registration.status = :status THEN 1 END)`,
        'registered_count',
      )
      .setParameter('status', RegistrationStatus.REGISTERED)
      // Grupowanie po ID eventu jest konieczne przy funkcjach agregujących
      .groupBy('event.id')
      // Sortujemy od największej liczby rezerwacji
      .orderBy('registered_count', 'DESC')
      // Bierzemy 5 najlepszych
      .limit(5)
      // Ponieważ chcemy pełne obiekty i dodatkowe pole, używamy getRawAndEntities
      .getRawAndEntities();

    const { entities, raw } = await qb;

    return entities.map((event, index) => {
      const registered = Number(raw[index].registered_count);
      const limit = event.limit ?? 0;

      return {
        ...event,
        description: event.description ? event.description.replace(/\\n/g, '\n') : event.description,
        registered,
        available: Math.max(0, limit - registered),
        occupancyPercent: limit ? Math.round((registered / limit) * 100) : 0,
      };
    });
  }
  private async getEventsWithStats(eventId?: number) {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.registrations', 'registration')
      .addSelect(
        `COUNT(CASE WHEN registration.status = :status THEN 1 END)`,
        'registered',
      )
      .setParameter('status', RegistrationStatus.REGISTERED)
      .groupBy('date_start');

    if (eventId) {
      qb.where('event.id = :id', { id: eventId });
    }

    const events = await qb.getMany();
    const raw = await qb.getRawMany();

    return events.map((event: any, i) => {
      const registered = Number(raw[i]?.registered ?? 0);
      const limit = event.limit ?? 0;

      return {
        ...event,
        description: event.description ? event.description.replace(/\\n/g, '\n') : event.description,
        registered,
        available: Math.max(0, limit - registered),
        occupancyPercent: limit ? Math.round((registered / limit) * 100) : 0,
      };
    });
  }

  async search(query?: string) {
    const qb = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.registrations', 'registrations')
      .distinct(true);

    if (!query?.trim()) {
      const events = await qb
        .orderBy('event.dateStart', 'DESC')
        .limit(50)
        .getMany();

      return this.enrichWithAvailability(events);
    }

    const terms = this.normalizeQuery(query);

    this.applySearch(qb, terms);

    const events = await qb
      .orderBy('event.dateStart', 'DESC')
      .limit(50)
      .getMany();

    return this.enrichWithAvailability(events);
  }

  private applySearch(qb: SelectQueryBuilder<Event>, terms: string[]) {
    const fields: (keyof Event)[] = [
      'name',
      'description',
      'location',
      'adress',
      'category',
    ];

    terms.forEach((term, index) => {
      const paramKey = `t${index}`;
      const paramValue = `%${term.toLowerCase()}%`;

      const orConditions = fields.map(
        (field) => `LOWER(event.${field}) LIKE :${paramKey}`,
      );

      const condition = `(${orConditions.join(' OR ')})`;

      if (index === 0) {
        qb.where(condition, { [paramKey]: paramValue });
      } else {
        qb.andWhere(condition, { [paramKey]: paramValue });
      }
    });
  }

  private normalizeQuery(query: string): string[] {
    return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }

  private enrichWithAvailability(events: Event[]) {
    return events.map((event) => {
      const registered =
        event.registrations?.filter(
          (r) => r.status === RegistrationStatus.REGISTERED,
        ).length ?? 0;

      const limit = event.limit ?? null;

      const available = limit !== null ? Math.max(0, limit - registered) : null;

      const occupancyPercent = limit
        ? Math.round((registered / limit) * 100)
        : 0;

      return {
        ...event,
        description: event.description ? event.description.replace(/\\n/g, '\n') : event.description,
        registered,
        available,
        occupancyPercent,
      };
    });
  }

  async create(createEventDto: any) {
    const event = this.eventRepository.create(createEventDto);
    return await this.eventRepository.save(event);
  }
}
