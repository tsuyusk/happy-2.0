import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Orphanage } from './entities/orphanage.entity';
import { OrphanagePhoto } from './entities/orphanagePhoto.entity';

interface CreateOrphanageRequestDto {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  whatsapp: string;
  visiting_hours: string;
  open_on_weekends: boolean;
  photos: any;
}

@Injectable()
export class OrphanagesRepository {
  constructor(
    @InjectRepository(Orphanage)
    private readonly ormRepository: Repository<Orphanage>,
    @InjectRepository(OrphanagePhoto)
    private readonly photosRepository: Repository<OrphanagePhoto>,
  ) {}

  async create({
    name,
    about,
    instructions,
    latitude,
    longitude,
    open_on_weekends,
    visiting_hours,
    whatsapp,
    photos,
  }: CreateOrphanageRequestDto): Promise<Orphanage> {
    const orphanage = this.ormRepository.create({
      name,
      about,
      whatsapp,
      photos,
      instructions,
      latitude: Number(latitude),
      longitude: Number(longitude),
      open_on_weekends,
      visiting_hours,
    });

    await this.ormRepository.save(orphanage);

    return orphanage;
  }

  async save(orphanage: Orphanage): Promise<Orphanage> {
    const photos = await this.photosRepository.find({
      where: { orphanage_id: orphanage.id },
    });
    await this.photosRepository.remove(photos);

    return this.ormRepository.save(orphanage);
  }

  async findById(id: string): Promise<Orphanage | undefined> {
    const orphanage = await this.ormRepository.findOne({
      where: { id },
      relations: ['photos'],
    });

    return orphanage;
  }

  async findAll(): Promise<Orphanage[]> {
    const orphanages = await this.ormRepository.find({
      relations: ['photos'],
    });

    return orphanages;
  }

  async deleteEntity(orphanage: Orphanage): Promise<void> {
    const orphanagePhotos = await this.photosRepository.find({
      where: { orphanage_id: orphanage.id },
    });

    await this.photosRepository.remove(orphanagePhotos);

    await this.ormRepository.remove(orphanage);
  }
}
