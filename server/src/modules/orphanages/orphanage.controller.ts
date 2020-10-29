import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { classToClass } from 'class-transformer';

import { CreateOrphanageDto } from './interfaces/create-orphanage.dto';
import { UpdateOrphanageDto } from './interfaces/update-orphanage.dto';
import { OrphanageService } from './orphanage.service';
import uploadConfig from '../../config/upload';

@Controller('orphanages')
export class OrphanageController {
  constructor(
    @Inject('OrphanageService')
    private orphanageService: OrphanageService,
  ) {}

  @Get()
  async index() {
    const orphanages = await this.orphanageService.getAll();

    return classToClass(orphanages);
  }

  @Get(':id')
  async show(@Param('id', ParseUUIDPipe) id: string) {
    const orphanage = await this.orphanageService.findById(id);

    return classToClass(orphanage);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('orphanage_photos', 5, uploadConfig))
  async create(
    @Body()
    {
      name,
      latitude,
      longitude,
      about,
      instructions,
      whatsapp,
      open_on_weekends,
      visiting_hours,
    }: CreateOrphanageDto,
    @UploadedFiles()
    photos: Array<{ filename: string }>,
  ) {
    if (photos.length === 0) {
      throw new HttpException('Missing pictures', 400);
    }

    const orphanage = await this.orphanageService.create({
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
      about,
      instructions,
      whatsapp,
      open_on_weekends: String(open_on_weekends) === 'true',
      visiting_hours,
      photos: photos.map(photo => ({ filename: photo.filename })),
    });

    return classToClass(orphanage);
  }

  @Get('requests/all')
  async getRequests() {
    const requestOrphanages = await this.orphanageService.listRequests();

    return classToClass(requestOrphanages);
  }

  @Post('requests/accept/:id')
  async acceptOrphanage(@Param('id', ParseUUIDPipe) id: string) {
    const orphanage = await this.orphanageService.acceptOrphanage({ id });

    return classToClass(orphanage);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.orphanageService.delete({ id });
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('orphanage_photos', 5, uploadConfig))
  async update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body()
    {
      name,
      latitude,
      longitude,
      about,
      instructions,
      whatsapp,
      open_on_weekends,
      visiting_hours,
    }: UpdateOrphanageDto,
    @UploadedFiles()
    photos: Array<{ filename: string }>,
  ) {
    if (photos.length === 0) {
      throw new HttpException('Missing pictures', 400);
    }

    const orphanage = await this.orphanageService.update({
      id,
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
      about,
      instructions,
      whatsapp,
      open_on_weekends: String(open_on_weekends) === 'true',
      visiting_hours,
      photos: photos.map(photo => ({ filename: photo.filename })),
    });

    return classToClass(orphanage);
  }
}
