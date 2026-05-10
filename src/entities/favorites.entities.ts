import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entities';
import { Event } from './event.entities';

@Entity('favorites')
@Unique(['user', 'event'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @CreateDateColumn()
  createdAt!: Date;
}
