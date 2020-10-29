import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestOrphanage } from './entities/requestOrphanage.entity';
import { RequestOrphanagePhoto } from './entities/requestOrphanagePhoto.entity';

interface CreateRequestOrphanageRequestDto {
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
export class RequestOrphanagesRepository {
  constructor(
    @InjectRepository(RequestOrphanage)
    private readonly ormRepository: Repository<RequestOrphanage>,
    @InjectRepository(RequestOrphanagePhoto)
    private readonly requestOrphanagePhotoRepository: Repository<
      RequestOrphanagePhoto
    >,
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
  }: CreateRequestOrphanageRequestDto): Promise<RequestOrphanage> {
    const RequestOrphanage = this.ormRepository.create({
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

    await this.ormRepository.save(RequestOrphanage);

    return RequestOrphanage;
  }

  async findById(id: string): Promise<RequestOrphanage | undefined> {
    const RequestOrphanage = await this.ormRepository.findOne({
      where: { id },
      relations: ['photos'],
    });

    return RequestOrphanage;
  }

  async findAll(): Promise<RequestOrphanage[]> {
    const RequestOrphanages = await this.ormRepository.find({
      relations: ['photos'],
    });

    return RequestOrphanages;
  }

  async delete(requestOrphanage: RequestOrphanage): Promise<void> {
    const photosFromRequestOrphanage = await this.requestOrphanagePhotoRepository.find(
      {
        where: {
          request_orphanage_id: requestOrphanage.id,
        },
      },
    );

    await this.requestOrphanagePhotoRepository.remove(
      photosFromRequestOrphanage,
    );

    await this.ormRepository.remove(requestOrphanage);
  }
}
