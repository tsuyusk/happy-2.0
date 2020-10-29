import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateOrphanageDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  about: string;

  @IsString()
  instructions: string;

  @IsString()
  whatsapp: string;

  @IsString()
  visiting_hours: string;

  @IsBoolean()
  open_on_weekends: boolean;

  photos: any;
}
