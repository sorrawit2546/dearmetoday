import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
// import { quickNoteResult } from './Entity/quick-note.entity';
import { QuickNoteService } from './quick-note.service';
import { ThankMessage } from '@prisma/client';
import { quickNoteDto } from './Dto/quick-note.dto';

@Controller('quick-note')
export class QuickNoteController {
  constructor(private readonly quickNoteService: QuickNoteService) {}
  @Post()
  async createQuickNote(
    @Req() req: Request,
    @Body() thankMessageDto: quickNoteDto,
  ): Promise<Partial<ThankMessage>> {
    const token = (req.cookies as { [key: string]: string })?.access_token;
    console.log(token);
    let userId: string | null = null;
    const secret = process.env.JWT_SECRET;
    if (token) {
      try {
        const payload = jwt.verify(token, secret) as {
          sub: string;
        };
        userId = payload.sub;
      } catch (error) {
        throw new UnauthorizedException('Token is invalid!', error);
      }
    }
    const result = await this.quickNoteService.createQuickNote(
      userId,
      thankMessageDto,
    );
    return result;
  }

  @Get()
  async getAllQuickNote(@Req() req: Request) {
    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) {
      throw new UnauthorizedException(['token not found']);
    }
    const secret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret) as {
      sub: string;
    };
    const userId = payload.sub;
    return await this.quickNoteService.getAllQuickNote(userId);
  }
}
