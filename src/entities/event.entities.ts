import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { EventRegistration } from './reservations.entities';

@Entity('events')
export class Event {
 @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({  name: 'date_start', type: 'datetime' })
  dateStart!: Date;

  @Column({  name: 'date_end', type: 'datetime' })
  dateEnd!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  adress!: string;

  @Column({ type: 'int', nullable: true })
  limit!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category!: string;

  @Column({ name: 'photo_path', type: 'varchar', length: 255, nullable: true })
  photoPath!: string;

  @CreateDateColumn({  name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @OneToMany(() => EventRegistration, (reg) => reg.event)
  registrations!: EventRegistration[];
}