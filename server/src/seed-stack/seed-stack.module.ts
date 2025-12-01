import { Module } from '@nestjs/common';
import { SeedsController } from './seed-stack.controller';
import { SeedStackService } from './seed-stack.service';
import { SeedStackRepository } from './seed-stack.repository';

@Module({
  controllers: [SeedsController],
  providers: [SeedStackService, SeedStackRepository],
})
export class SeedStackModule {}
