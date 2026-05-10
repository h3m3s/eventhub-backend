import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entities';
import { Event } from './event.entities';

export enum RegistrationStatus {
  REGISTERED = 'REGISTERED',
  CANCELLED = 'CANCELLED',
  FAVORITES = 'FAVORITES',
}

@Entity('event_reservation')
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Event, (event) => event.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt!: Date;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.REGISTERED,
  })
  status!: RegistrationStatus;
}
