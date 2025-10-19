import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  houseNumber?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  cityEn?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

//todo expand dto, not in the scope at the moment.
export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @Type(() => LocationDto)
  @ValidateNested()
  @IsOptional()
  location?: LocationDto;
}
