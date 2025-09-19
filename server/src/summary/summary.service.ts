import { Injectable } from '@nestjs/common';
import { SummaryRepository } from './summary.repository';

@Injectable()
export class SummaryService {
  constructor(private readonly summaryRepository: SummaryRepository) {}

  async getMoodSummary(userId: string) {
    const today = new Date();

    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - 6);

    const prevWeekStart = new Date(today);
    prevWeekStart.setDate(today.getDate() - 13);

    const start14days = new Date(today);
    start14days.setDate(today.getDate() - 13);

    // --- Daily data
    const dailyRaw = await this.summaryRepository.getMoodSummary(
      start14days,
      today,
      userId,
    );

    // --- Weekly averages
    const [currentWeekRaw] = await this.summaryRepository.getWeeklyAvg(
      currentWeekStart,
      today,
      userId,
    );
    const [prevWeekRaw] = await this.summaryRepository.getWeeklyAvg(
      prevWeekStart,
      currentWeekStart,
      userId,
    );

    const currentWeekStartStr = currentWeekStart.toISOString().slice(0, 10);
    const prevWeekStartStr = prevWeekStart.toISOString().slice(0, 10);

    const currentWeekDaily = dailyRaw.filter(
      (r) => new Date(r.date).toISOString().slice(0, 10) >= currentWeekStartStr,
    );
    const prevWeekDaily = dailyRaw.filter(
      (r) =>
        new Date(r.date).toISOString().slice(0, 10) >= prevWeekStartStr &&
        new Date(r.date).toISOString().slice(0, 10) < currentWeekStartStr,
    );

    // --- คำนวณ % เปลี่ยนแปลง พร้อมกำหนดทิศทาง
    let diffPercent: number;
    let diffDirection: 'up' | 'down' | 'same';

    if (!prevWeekRaw || prevWeekRaw.count === 0) {
      diffPercent = 100;
      diffDirection = 'up';
    } else if (
      currentWeekRaw?.avgMood != null &&
      prevWeekRaw?.avgMood != null
    ) {
      diffPercent =
        ((currentWeekRaw.avgMood - prevWeekRaw.avgMood) / prevWeekRaw.avgMood) *
        100;

      if (diffPercent > 0) diffDirection = 'up';
      else if (diffPercent < 0) diffDirection = 'down';
      else diffDirection = 'same';
    } else {
      diffPercent = 0;
      diffDirection = 'same';
    }

    return {
      daily: {
        currentWeek: currentWeekDaily,
        prevWeek: prevWeekDaily,
      },
      weekly: {
        currentWeek: currentWeekRaw ?? { avgMood: null, count: 0 },
        prevWeek: prevWeekRaw ?? { avgMood: null, count: 0 },
        diffPercent,
        diffDirection,
      },
    };
  }
}
