import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Mood } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreatePositiveNoteDto {
  @IsEmail()
  email: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string | null;

  @IsOptional()
  @IsString()
  line3?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[]; // เก็บหลาย URL ของรูปภาพ

  @IsEnum(Mood)
  mood: Mood;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;
}

export class CreatePositiveNoteAuthDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string | null;

  @IsOptional()
  @IsString()
  line3?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[]; // เก็บหลาย URL ของรูปภาพ

  @IsEnum(Mood)
  mood: Mood;

  @IsOptional()
  @IsBoolean()
  showMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;
}
