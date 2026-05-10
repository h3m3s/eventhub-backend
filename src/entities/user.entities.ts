import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { EventRegistration } from './reservations.entities';
import { Favorite } from './favorites.entities';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => EventRegistration, (reg) => reg.user)
  registrations!: EventRegistration[];

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites!: Favorite[];
}
