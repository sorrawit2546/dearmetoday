import { mkdir, writeFile, access } from 'fs/promises';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { join } from 'path';

export async function downloadAvatar(
  url: string,
  userId: string,
): Promise<string> {
  try {
    const uploadsDir = join(process.cwd(), 'uploads');
    const filename = `${userId}.jpg`; // ✅ ใช้ชื่อคงที่สำหรับแต่ละ user
    const filepath = join(uploadsDir, filename);

    // ✅ สร้างโฟลเดอร์ถ้ายังไม่มี
    await mkdir(uploadsDir, { recursive: true });

    // ✅ ถ้ามีไฟล์อยู่แล้ว ให้ข้ามการดาวน์โหลด
    try {
      await access(filepath, fs.constants.F_OK);
      return `/uploads/${filename}`;
    } catch {
      // file ไม่พบ → ไปโหลดต่อ
    }

    // ✅ โหลด avatar ถ้าไฟล์ยังไม่มี
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const protocol = url.startsWith('https:') ? https : http;
      protocol
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to fetch avatar: ${res.statusCode}`));
            return;
          }
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
          res.on('error', reject);
        })
        .on('error', reject);
    });

    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error downloading avatar:', error);
    return '';
  }
}
