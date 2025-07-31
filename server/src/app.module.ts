import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositiveNoteModule } from './positive-note/positive-note.module';

@Module({
  imports: [PositiveNoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
