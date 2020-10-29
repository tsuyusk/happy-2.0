import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrphanagePhoto } from '../entities/orphanagePhoto.entity';

@Entity('orphanages')
export class Orphanage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @Column()
  about: string;

  @Column()
  whatsapp: string;

  @Column()
  instructions: string;

  @Column()
  visiting_hours: string;

  @Column({ type: 'boolean' })
  open_on_weekends: boolean;

  @OneToMany(
    () => OrphanagePhoto,
    orphanagePhoto => orphanagePhoto.orphanage,
    {
      cascade: true,
    },
  )
  @JoinColumn({ name: 'orphanage_id' })
  photos: OrphanagePhoto[];
}
