import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SummaryRepository {
  constructor(private prisma: PrismaService) {}
  async getMoodSummary(start: Date, end: Date, userId: string) {
    const raw = await this.prisma.$queryRaw<
      { date: string; avgMood: number; count: number }[]
    >`
  SELECT 
    DATE("created_at") AS date,
    AVG("mood_score")::float AS "avgMood",
    COUNT(*)::int AS "count"
  FROM "entries"
  WHERE "is_delete" = false
    AND "user_id" = ${userId}
    AND "created_at" BETWEEN ${start} AND ${end}
  GROUP BY DATE("created_at")
  ORDER BY date ASC
`;
    return raw;
  }

  async getWeeklyAvg(start: Date, end: Date, userId: string) {
    return this.prisma.$queryRaw<{ avgMood: number; count: number }[]>`
      SELECT 
        AVG("mood_score")::float AS "avgMood",
        COUNT(*)::int AS "count"
      FROM "entries"
      WHERE "is_delete" = false
        AND "user_id" = ${userId}
        AND "created_at" BETWEEN ${start} AND ${end}
    `;
  }
}
