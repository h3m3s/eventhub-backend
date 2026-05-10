import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dateStart!: string;

  @IsDateString()
  dateEnd!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  adress?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  photoPath?: string;
}
