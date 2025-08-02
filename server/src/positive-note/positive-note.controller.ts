import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { PositiveNoteService } from './positive-note.service';
import { Entry } from '@prisma/client';

@Controller('positive-note')
export class PositiveNoteController {
  constructor(private readonly positivenoteService: PositiveNoteService) {}

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('imageUrls', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async createPositiveNote(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePositiveNoteDto,
  ): Promise<Entry> {
    const imageUrls = files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`,
    );

    return this.positivenoteService.createPositiveNote({
      ...body,
      imageUrls: imageUrls,
    });
  }
}
