import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function downloadAvatar(url: string, userId: string) {
  const filename = `${userId}-${Date.now()}.jpg`;
  const filepath = join(__dirname, '..', '..', 'uploads', filename);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch avatar: ${res.status}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}
