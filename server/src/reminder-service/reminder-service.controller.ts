import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResendService } from 'src/third-party/resend/resend.service';

@Controller('reminder-service')
export class ReminderServiceController {
  constructor(
    private resendService: ResendService,
    private prisma: PrismaService,
  ) {}

  // @Get('test-reminder/:userId')
  // async testReminder(@Param('userId') userId: string) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     select: { email: true, name: true, id: true },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`User not found: ${userId}`);
  //   }

  //   return this.resendService.sendReminderEmail(user.email, user.name);
  // }
}
