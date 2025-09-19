import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { PositiveNoteModule } from './positive-note/positive-note.module';
import { PrismaModule } from './prisma/prisma.module';
import { SendgridModule } from './third-party/sendgrid/sendgrid.module';
import { CalendarService } from './calendar/calendar.service';
import { CalendarModule } from './calendar/calendar.module';
import { QuickNoteModule } from './quick-note/quick-note.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    QuickNoteModule,
    PositiveNoteModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL prefix เช่น http://localhost:3000/uploads/
    }),
    SendgridModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.local',
    }),
    CalendarModule,
    QuickNoteModule,
    SummaryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    CalendarService,
  ],
})
export class AppModule {
  constructor() {
    console.log('AppModule: NODE_ENV =', process.env.NODE_ENV);
    console.log('AppModule: SERVER_URL =', process.env.SERVER_URL);
    console.log(
      'AppModule: Will read env file:',
      process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
    );
  }
}
