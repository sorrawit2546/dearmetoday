import { Module } from '@nestjs/common';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { SummaryRepository } from './summary.repository';

@Module({
  controllers: [SummaryController],
  providers: [SummaryService, SummaryRepository],
})
export class SummaryModule {}
