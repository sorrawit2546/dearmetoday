export interface DailyEntry {
    date: string;        // ISO string ของวันที่ (เช่น "2025-09-19T00:00:00.000Z")
    avgMood: number;     // ค่าเฉลี่ย mood_score ของวันนั้น
    count: number;       // จำนวน entries ของวันนั้น
  }
  
  export interface WeeklyStats {
    avgMood: number | null;  // null ถ้ายังไม่มีข้อมูลเลย
    count: number;            // จำนวน entries ในสัปดาห์นั้น
  }
  
  export interface WeeklySummary {
    currentWeek: WeeklyStats;
    prevWeek: WeeklyStats;
    diffPercent: number;                 // เปอร์เซ็นต์เพิ่ม/ลดเทียบสัปดาห์ก่อน
    diffDirection: 'up' | 'down' | 'same'; // ทิศทางแนวโน้ม
  }
  
  export interface DailySummary {
    currentWeek: DailyEntry[];
    prevWeek: DailyEntry[];
  }
  
  export interface SummaryResponse {
    daily: DailySummary;
    weekly: WeeklySummary;
  }
  