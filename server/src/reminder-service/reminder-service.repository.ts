import { BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { error } from 'console';
import { PrismaService } from 'src/prisma/prisma.service';
export class ReminderServiceRepository {
  constructor(private prisma: PrismaService) {}

  public async getAllUser(): Promise<
    Array<Pick<User, 'id' | 'email' | 'name'>>
  > {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  public async checkUserWriteNoteToday(userId: string): Promise<boolean> {
    try {
      if (!userId) throw new error('Undifind userId!');
      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
      );

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
      );

      const haveNoteByUsers = await this.prisma.entry.findFirst({
        where: {
          userId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        select: { id: true },
      });
      return !!haveNoteByUsers;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
