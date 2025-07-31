import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Mood } from 'generated/prisma';

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
