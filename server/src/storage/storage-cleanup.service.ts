import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StorageCleanupService {
  private readonly supabase = createClient(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    process.env.SUPABASE_URL!,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    process.env.SUPABASE_KEY!,
  );
  private readonly bucket =
    process.env.SUPABASE_BUCKET ?? 'web.image.dearmetoday';
  private readonly logger = new Logger(StorageCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  async cleanupUnusedFiles() {
    this.logger.log('🧹 Starting cleanup of unused files...');

    // 1️⃣ ดึงรายชื่อไฟล์ทั้งหมดใน bucket
    const { data: files, error } = await this.supabase.storage
      .from(this.bucket)
      .list('', { limit: 1000 });

    if (error) throw error;
    const allFileNames = files?.map((f) => f.name) ?? [];

    // 2️⃣ ดึงรายการ imageUrls จาก note ที่ยังไม่ถูกลบ (isDeleted = false)
    const activeEntries = await this.prisma.entry.findMany({
      where: { isDelete: false },
      select: { imageUrls: true },
    });

    // 3️⃣ สร้าง set ของไฟล์ที่ยังใช้งาน
    const usedFileNames = new Set<string>();
    for (const entry of activeEntries) {
      for (const url of entry.imageUrls ?? []) {
        const match = url.match(/\/([^/?#]+)$/); // ดึงชื่อไฟล์จาก URL
        if (match) usedFileNames.add(match[1]);
      }
    }

    // 4️⃣ หาไฟล์ที่ไม่มีใน DB (ไม่ได้ใช้งานแล้ว)
    const unusedFiles = allFileNames.filter((f) => !usedFileNames.has(f));

    if (unusedFiles.length === 0) {
      this.logger.log('✅ No unused files found.');
      return;
    }

    // 5️⃣ ลบไฟล์ที่ไม่ได้ใช้งาน
    this.logger.warn(`🗑️ Deleting ${unusedFiles.length} unused files...`);
    const { error: removeError } = await this.supabase.storage
      .from(this.bucket)
      .remove(unusedFiles);
    if (removeError) throw removeError;

    this.logger.log('✅ Cleanup complete.');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCleanup() {
    await this.cleanupUnusedFiles();
  }
}
