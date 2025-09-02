import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class quickNoteDto {
  @IsString()
  @IsOptional()
  id: string;
  @IsString()
  @MinLength(1)
  thankMessage: string;
  @IsString()
  @IsOptional()
  isDelete: boolean;
  @IsOptional()
  createdAt: Date;
  @IsString()
  @IsOptional()
  userId: string;
}
