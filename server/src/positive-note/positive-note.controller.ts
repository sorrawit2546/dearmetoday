import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Entry } from '@prisma/client';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreatePositiveNoteAuthDto,
  CreatePositiveNoteDto,
  UpdatePositiveNoteDeleteDto,
  UpdatePositiveNoteDto,
} from './Dto/create-positive-note';
import {
  getAllNotesCommunity,
  getAllNoteSendById,
  IpositiveNoteByNoteId,
} from './entity/positive-note.entity';
import { PositiveNoteService } from './positive-note.service';

interface JwtUser {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

@Controller('positive-note')
export class PositiveNoteController {
  constructor(private readonly positivenoteService: PositiveNoteService) {}
  BASE_URL = process.env.SERVER_URL;

  @Put('note/:id')
  async deletePositiveNoteById(
    @Param('id') noteId: string,
    @Req() req: Request,
    @Body() Dto: UpdatePositiveNoteDeleteDto,
  ): Promise<string> {
    if (!req) throw new UnauthorizedException();
    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) throw new UnauthorizedException('Token not found');

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    const userId = decoded.sub;
    await this.positivenoteService.deletePositiveNoteById(noteId, userId, Dto);
    return 'Positive Note is Deleted!';
  }

  @Patch('note/:id')
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
  async editPositiveNoteByNoteId(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
    @Param('id') noteId: string,
    @Body() body: any, // ← ต้องเป็น any เพื่อรับจาก FormData
  ): Promise<Partial<IpositiveNoteByNoteId>> {
    if (!req) throw new UnauthorizedException();
    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) throw new UnauthorizedException('Token not found');

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    const userId = decoded.sub;

    // ✅ แปลง string กลับเป็น type ที่ต้องการ
    const Dto: Partial<UpdatePositiveNoteDto> = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      line1: body?.line1 ?? undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      line2: body?.line2 ?? undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      line3: body?.line3 ?? undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      mood: body?.mood ?? undefined,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      showMessage: body?.showMessage ? body.showMessage === 'true' : undefined,
    };

    // Handle image URLs (existing + new)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (body?.existingImageUrls || files?.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const existingUrls = Array.isArray(body.existingImageUrls)
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          body.existingImageUrls
        : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          body.existingImageUrls
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            [body.existingImageUrls]
          : [];

      // Generate URLs for new uploaded files
      const newImageUrls = files.map(
        (file) => `${this.BASE_URL}/uploads/${file.filename}`,
      );

      // Combine existing and new image URLs
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      Dto.imageUrls = [...existingUrls, ...newImageUrls];
    }

    return await this.positivenoteService.editPositiveNoteById(
      noteId,
      userId,
      Dto,
    );
  }

  @Get('note/:id')
  async getPositiveNoteByNoteId(
    @Req() req: Request,
    @Param('id') noteId: string,
  ): Promise<IpositiveNoteByNoteId> {
    if (!req) {
      throw new UnauthorizedException();
    }
    const token = (req.cookies as { [key: string]: string })?.access_token;

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    // ตรวจสอบและถอดรหัส
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    const userId = decoded.sub;
    return this.positivenoteService.getPositiveNoteById(noteId, userId);
  }

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

    const access_token_google = req.cookies as { google_access_token?: string };
    const token = access_token_google?.google_access_token;
    // ถ้ามี token ให้ใช้ email จาก token แทน
    if (user?.email) {
      emailToUse = user.email;
    }

    return this.positivenoteService.createPositiveNote(
      {
        ...body,
        email: emailToUse,
        imageUrls: imageUrls,
        showMessage: Boolean(body.showMessage),
      },
      token ?? '',
    );
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

  @Post('getnote-userid')
  async getAllpositiveNoteById(@Req() req: Request) {
    // ดึง token จาก cookie (สมมติชื่อ cookie คือ accessToken)

    const token = (req.cookies as { [key: string]: string })?.access_token;

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // ตรวจสอบและถอดรหัส
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
      };
      const userId = decoded.sub;

      // ดึงข้อมูลจาก service ตาม userId
      return await this.positivenoteService.getAllNoteByUserId(userId);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token', error);
    }
  }

  @Post('recent-note')
  async recentNote(@Req() req: Request): Promise<getAllNoteSendById> {
    const token = (req.cookies as { [key: string]: string })?.access_token;
    console.log(token);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string | undefined;
      };
      const userId = payload.sub;
      const result = await this.positivenoteService.recentNoteByUserId(userId);
      return result;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  @Post('all-note')
  async getAllpositiveNotesWithoutLatest(@Req() req: Request) {
    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string | undefined;
      };
      const userId = payload.sub;
      const result =
        await this.positivenoteService.getAllpositiveNotesWithoutLatest(userId);
      return result;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadGatewayException(['Bad Gateway Exception']);
    }
  }

  @Get('community-notes')
  async getAllCommunityNote(): Promise<getAllNotesCommunity[]> {
    return await this.positivenoteService.getAllCommunityNote();
  }
}
