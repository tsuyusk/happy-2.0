import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Orphanage } from '../entities/orphanage.entity';

@Entity('orphanages_photos')
export class OrphanagePhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  orphanage_id: string;

  @ManyToOne(
    () => Orphanage,
    orphanage => orphanage.photos,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'orphanage_id' })
  orphanage: Orphanage;
}
