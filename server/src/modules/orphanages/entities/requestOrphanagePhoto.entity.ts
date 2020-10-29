import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RequestOrphanage } from '../entities/requestOrphanage.entity';

@Entity('request_orphanages_photos')
export class RequestOrphanagePhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  request_orphanage_id: string;

  @ManyToOne(
    () => RequestOrphanage,
    requestOrphanage => requestOrphanage.photos,
  )
  @JoinColumn({ name: 'request_orphanage_id' })
  orphanage: RequestOrphanage;
}
