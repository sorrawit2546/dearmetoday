import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function downloadAvatar(url: string, userId: string) {
  const uploadsDir = join(process.cwd(), 'uploads'); // ✅ ใช้ root ของโปรเจกต์
  const filename = `${userId}-${Date.now()}.jpg`;
  const filepath = join(uploadsDir, filename);

  // ✅ สร้างโฟลเดอร์หากยังไม่มี
  await mkdir(uploadsDir, { recursive: true });

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch avatar: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(filepath, buffer);

  return `/uploads/${filename}`; // path ที่ client จะใช้เข้าถึง
}
