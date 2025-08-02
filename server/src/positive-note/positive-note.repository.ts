import { Injectable } from '@nestjs/common';
import { Entry } from '@prisma/client';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositiveNoteRepository {
  constructor(private prisma: PrismaService) {}

  async createPositiveNote(
    createPositiveNoteDto: CreatePositiveNoteDto,
  ): Promise<Entry> {
    let userId: string | null = null;

    // ถ้ามี email ให้หา user
    if (createPositiveNoteDto.email) {
      const user = await this.prisma.user.findUnique({
        where: { email: createPositiveNoteDto.email },
        select: {
          id: true,
        },
      });

      if (user) {
        userId = user.id;
      }
    }

    const result = await this.prisma.entry.create({
      data: {
        ...createPositiveNoteDto,
        userId: userId, // จะเป็น null ถ้าไม่มี user
      },
    });
    return result;
  }
}
