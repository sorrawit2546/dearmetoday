import { mkdir, writeFile } from 'fs/promises';
import * as http from 'http';
import * as https from 'https';
import { join } from 'path';

export async function downloadAvatar(
  url: string,
  userId: string,
): Promise<string> {
  try {
    const uploadsDir = join(process.cwd(), 'uploads'); // ✅ ใช้ root ของโปรเจกต์
    const filename = `${userId}-${Date.now()}.jpg`;
    const filepath = join(uploadsDir, filename);

    // ✅ สร้างโฟลเดอร์หากยังไม่มี
    await mkdir(uploadsDir, { recursive: true });

    // ใช้ Node.js built-in modules แทน fetch
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

    return `/uploads/${filename}`; // path ที่ client จะใช้เข้าถึง
  } catch (error) {
    console.error('Error downloading avatar:', error);
    // Return a default avatar or empty string if download fails
    return '';
  }
}
