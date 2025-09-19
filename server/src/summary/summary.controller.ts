import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('positive-mood')
  async getMoodSummary(@Req() req: Request) {
    if (!req) throw new UnauthorizedException();
    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) throw new UnauthorizedException('Token not found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    const userId = decoded.sub;
    return await this.summaryService.getMoodSummary(userId);
  }
}
