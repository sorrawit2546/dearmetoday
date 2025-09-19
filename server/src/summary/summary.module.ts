import { Module } from '@nestjs/common';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { SummaryRepository } from './summary.repository';
import { SummaryGateway } from './summary.gateway';

@Module({
  controllers: [SummaryController],
  providers: [SummaryService, SummaryRepository, SummaryGateway],
  exports: [SummaryGateway],
})
export class SummaryModule {}
