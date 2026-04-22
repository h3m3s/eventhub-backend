import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistration, RegistrationStatus } from 'src/entities/reservations.entities';
import { Event } from 'src/entities/event.entities';
import { User } from 'src/entities/user.entities';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(EventRegistration)
    private readonly registrationRepository: Repository<EventRegistration>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createReservation(eventId: number, userId: number) {
    // Sprawdź czy event istnieje
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['registrations'],
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    // Sprawdź czy user istnieje
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Sprawdź czy user już się zapisał
    const existingReg = await this.registrationRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });

    if (existingReg) {
      throw new BadRequestException('User already registered for this event');
    }

    // Policz aktywne rejestracje
    const activeRegistrations = await this.registrationRepository.count({
      where: {
        event: { id: eventId },
        status: RegistrationStatus.REGISTERED,
      },
    });

    // Sprawdź czy jest jeszcze miejsce
    if (event.limit && activeRegistrations >= event.limit) {
      throw new BadRequestException('Event is full');
    }

    // Stwórz rezerwację
    const registration = this.registrationRepository.create({
      event,
      user,
      status: RegistrationStatus.REGISTERED,
    });

    return this.registrationRepository.save(registration);
  }

  async cancelReservation(eventId: number, userId: number) {
    const registration = await this.registrationRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
        status: RegistrationStatus.REGISTERED,
      },
    });

    if (!registration) {
      throw new BadRequestException('Registration not found');
    }

    registration.status = RegistrationStatus.CANCELLED;
    return this.registrationRepository.save(registration);
  }

  async getEventStats(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    // Policz aktywne rejestracje
    const registeredCount = await this.registrationRepository.count({
      where: {
        event: { id: eventId },
        status: RegistrationStatus.REGISTERED,
      },
    });

    const available = event.limit ? event.limit - registeredCount : 0;
    const occupancyPercent = event.limit
      ? Math.round((registeredCount / event.limit) * 100)
      : 0;

    return {
      eventId,
      limit: event.limit,
      registered: registeredCount,
      available: Math.max(0, available),
      occupancyPercent,
    };
  }
}
