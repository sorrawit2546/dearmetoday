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
  Sse,
  UnauthorizedException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Entry } from '@prisma/client';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
// import { diskStorage } from 'multer';
import * as multer from 'multer';
import { interval, Observable, switchMap } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import {
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
  constructor(
    private readonly positivenoteService: PositiveNoteService,
    private readonly storageService: StorageService,
  ) {}
  BASE_URL = process.env.SERVER_URL;

  @Sse('allnote-dearme/stream')
  getAllPositiveNoteInDearme(): Observable<MessageEvent> {
    return interval(5000).pipe(
      switchMap(async () => {
        const count =
          await this.positivenoteService.getAllPositiveNoteInDearme();
        return {
          data: { count },
        } as MessageEvent;
      }),
    );
  }
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
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 3 * 1024 * 1024, // จำกัดขนาดไฟล์ไม่เกิน 3MB
      },
    }),
  )
  async editPositiveNoteByNoteId(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
    @Param('id') noteId: string,
    @Body() body: any, // ← ใช้ any เพื่อรองรับ FormData
  ): Promise<Partial<IpositiveNoteByNoteId>> {
    if (!req) throw new UnauthorizedException();

    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) throw new UnauthorizedException('Token not found');

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    const userId = decoded.sub;

    // ✅ เตรียม DTO สำหรับ update
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

    // ✅ จัดการรูปภาพ (existing + new)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const existingUrls = Array.isArray(body?.existingImageUrls)
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        body.existingImageUrls
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        body?.existingImageUrls
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          [body.existingImageUrls]
        : [];

    const newImageUrls: string[] = [];

    // ถ้ามีไฟล์ใหม่ → upload ขึ้น Supabase
    for (const file of files) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;
      const url = await this.storageService.uploadBuffer(file, uniqueName);
      newImageUrls.push(url);
    }

    // รวมภาพเดิม + ภาพใหม่
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Dto.imageUrls = [...existingUrls, ...newImageUrls];

    // ✅ เรียก service เพื่อบันทึก
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
      storage: multer.memoryStorage(),
      limits: { fileSize: 3 * 1024 * 1024 }, // จำกัด 3MB
    }),
  )
  async createPositiveNote(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePositiveNoteDto,
    @Req() req: Request,
  ): Promise<Entry> {
    const imageUrls: string[] = [];

    for (const file of files) {
      const uniqueName =
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        '-' +
        file.originalname;
      const url = await this.storageService.uploadBuffer(file, uniqueName);
      imageUrls.push(url);
    }

    const user = req.user as JwtUser;
    const emailToUse = user?.email ?? body.email;

    return this.positivenoteService.createPositiveNote({
      ...body,
      email: emailToUse,
      imageUrls,
      showMessage: Boolean(body.showMessage),
    });
  }

  // @Post('create-auth')
  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(
  //   FilesInterceptor('imageUrls', 10, {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (
  //         req: Request,
  //         file: Express.Multer.File,
  //         cb: (error: Error | null, filename: string) => void,
  //       ) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         cb(null, uniqueSuffix + extname(file.originalname));
  //       },
  //     }),
  //   }),
  // )
  // async createPositiveNoteWithAuth(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() body: CreatePositiveNoteAuthDto,
  //   @Req() req: Request,
  // ): Promise<Entry> {
  //   const imageUrls = files.map(
  //     (file) => `${this.BASE_URL}/uploads/${file.filename}`,
  //   );
  //   const user = req.user as JwtUser;
  //   if (!user?.email) {
  //     throw new UnauthorizedException('ไม่พบ email ใน token');
  //   }

  //   return this.positivenoteService.createPositiveNote({
  //     ...body,
  //     email: user.email, // ใช้ email จาก token แทน
  //     imageUrls: imageUrls,
  //   });
  // }

  @Post('getnote-userid')
  async getAllpositiveNoteById(@Req() req: Request) {
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
