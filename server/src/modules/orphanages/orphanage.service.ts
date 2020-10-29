import { Injectable, Inject, HttpException } from '@nestjs/common';

import { OrphanagesRepository } from './orphanage.repository';
import { RequestOrphanagesRepository } from './requestOrphanage.repository';

interface CreateOrphanageDto {
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

interface UpdateOrphanageDto {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  whatsapp: string;
  visiting_hours: string;
  open_on_weekends: boolean;
  photos: Array<{ filename: string }>;
}

@Injectable()
export class OrphanageService {
  constructor(
    @Inject('OrphanagesRepository')
    private orphanagesRepository: OrphanagesRepository,
    @Inject('RequestOrphanagesRepository')
    private requestOrphanagesRepository: RequestOrphanagesRepository,
  ) {}

  async create({
    name,
    latitude,
    longitude,
    about,
    instructions,
    open_on_weekends,
    visiting_hours,
    photos,
    whatsapp,
  }: CreateOrphanageDto) {
    const orphanage = await this.requestOrphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      open_on_weekends,
      visiting_hours,
      photos,
      whatsapp,
    });

    return orphanage;
  }

  async listRequests() {
    const requestOrphanages = await this.requestOrphanagesRepository.findAll();

    return requestOrphanages;
  }

  async acceptOrphanage({ id }: { id: string }) {
    const requestOrphanage = await this.requestOrphanagesRepository.findById(
      id,
    );

    if (!requestOrphanage) {
      throw new HttpException('Orphanage request not found', 400);
    }

    const orphanage = await this.orphanagesRepository.create(requestOrphanage);

    await this.requestOrphanagesRepository.delete(requestOrphanage);

    return orphanage;
  }

  async getAll() {
    const orphanages = await this.orphanagesRepository.findAll();

    return orphanages;
  }

  async findById(id: string) {
    const orphanage = await this.orphanagesRepository.findById(id);

    if (!orphanage) throw new HttpException('Orphanage not found', 400);

    return orphanage;
  }

  async delete({ id }: { id: string }) {
    const orphanage = await this.orphanagesRepository.findById(id);

    if (!orphanage) {
      throw new HttpException('Orphanage not found', 400);
    }

    await this.orphanagesRepository.deleteEntity(orphanage);
  }

  async update({
    id,
    name,
    latitude,
    longitude,
    about,
    instructions,
    open_on_weekends,
    visiting_hours,
    whatsapp,
    photos,
  }: UpdateOrphanageDto) {
    const orphanage = await this.orphanagesRepository.findById(id);

    if (!orphanage) {
      throw new HttpException('Orphanage not found', 400);
    }

    Object.assign(orphanage, {
      name,
      latitude,
      longitude,
      about,
      instructions,
      open_on_weekends,
      visiting_hours,
      whatsapp,
      photos: photos.map(photo => ({ ...photo, orphanage_id: orphanage.id })),
    });

    await this.orphanagesRepository.save(orphanage);

    return orphanage;
  }
}
