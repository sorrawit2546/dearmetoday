import {
  Controller,
  Get,
  Sse,
  MessageEvent,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryGateway } from './summary.gateway';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { filter, from, switchMap, map, merge } from 'rxjs';

@Controller('summary')
export class SummaryController {
  constructor(
    private readonly summaryService: SummaryService,
    private readonly summaryGateway: SummaryGateway,
  ) {}

  @Get('positive-mood')
  async getMoodSummary(@Req() req: Request) {
    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) throw new UnauthorizedException('Token not found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    return this.summaryService.getMoodSummary(decoded.sub);
  }

  @Sse('positive-mood/stream')
  streamMoodSummary(@Req() req: Request) {
    const token = (req.cookies as { [key: string]: string })?.access_token;
    if (!token) throw new UnauthorizedException('Token not found');
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
    };
    const userId = decoded.sub;

    const initial$ = from(this.summaryService.getMoodSummary(userId)).pipe(
      map((data) => ({ data }) as MessageEvent), // 🟢 ส่งครั้งแรกทันที
    );

    const updates$ = this.summaryGateway.stream$.pipe(
      filter((e) => e.userId === userId),
      switchMap(() => from(this.summaryService.getMoodSummary(userId))),
      map((data) => ({ data }) as MessageEvent),
    );

    return merge(initial$, updates$); // 🟢 รวม initial + updates
  }
}
