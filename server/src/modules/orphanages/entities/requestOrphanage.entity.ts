import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RequestOrphanagePhoto } from '../entities/requestOrphanagePhoto.entity';

@Entity('request_orphanages')
export class RequestOrphanage {
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
    () => RequestOrphanagePhoto,
    requestOrphanagePhoto => requestOrphanagePhoto.orphanage,
    {
      cascade: ['insert', 'update', 'remove'],
    },
  )
  @JoinColumn({ name: 'request_orphanage_id' })
  photos: RequestOrphanagePhoto[];
}
