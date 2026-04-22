import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { EventRegistration } from './reservations.entities';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @OneToMany(() => EventRegistration, (reg) => reg.user)
  registrations!: EventRegistration[];
}