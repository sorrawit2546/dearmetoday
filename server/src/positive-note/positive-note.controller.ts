import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import {
  CreatePositiveNoteDto,
  CreatePositiveNoteAuthDto,
} from './Dto/create-positive-note';
import { PositiveNoteService } from './positive-note.service';
import { Entry } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface JwtUser {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

@Controller('positive-note')
export class PositiveNoteController {
  constructor(private readonly positivenoteService: PositiveNoteService) {}
  BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

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
    @Req() req: Request,
  ): Promise<Entry> {
    const imageUrls = files.map(
      (file) => `${this.BASE_URL}/uploads/${file.filename}`,
    );

    // ตรวจสอบว่ามี token หรือไม่
    const user = req.user as JwtUser;
    let emailToUse = body.email; // ใช้ email จาก body เป็นค่าเริ่มต้น

    // ถ้ามี token ให้ใช้ email จาก token แทน
    if (user?.email) {
      emailToUse = user.email;
    }

    return this.positivenoteService.createPositiveNote({
      ...body,
      email: emailToUse,
      imageUrls: imageUrls,
      showMessage: Boolean(body.showMessage),
    });
  }

  @Post('create-auth')
  @UseGuards(JwtAuthGuard)
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
  async createPositiveNoteWithAuth(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePositiveNoteAuthDto,
    @Req() req: Request,
  ): Promise<Entry> {
    const imageUrls = files.map(
      (file) => `${this.BASE_URL}/uploads/${file.filename}`,
    );

    // รับ email จาก token ที่ผ่าน JWT guard แล้ว
    const user = req.user as JwtUser;

    if (!user?.email) {
      throw new UnauthorizedException('ไม่พบ email ใน token');
    }

    return this.positivenoteService.createPositiveNote({
      ...body,
      email: user.email, // ใช้ email จาก token แทน
      imageUrls: imageUrls,
    });
  }

  async getAllpositiveNoteById(@Req() req: Request) {}
}
