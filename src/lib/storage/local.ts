import { writeFile, readFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// LOCAL FILE STORAGE (Vercel /tmp compatible)
// For production, replace with S3
// ============================================

const UPLOAD_DIR = process.env.NODE_ENV === 'production' ? '/tmp/filelab' : path.join(process.cwd(), 'uploads');

async function ensureDir(dir: string): Promise<void> {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

export async function saveFile(
  buffer: Buffer,
  originalName: string,
  userId: string
): Promise<{ path: string; key: string }> {
  const ext = path.extname(originalName);
  const key = `${userId}/${uuidv4()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, key);

  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, buffer);

  return { path: filePath, key };
}

export async function getFile(key: string): Promise<Buffer> {
  const filePath = path.join(UPLOAD_DIR, key);
  return readFile(filePath);
}

export async function deleteFile(key: string): Promise<void> {
  const filePath = path.join(UPLOAD_DIR, key);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }
}

export async function saveProcessedFile(
  buffer: Buffer,
  originalName: string,
  userId: string,
  suffix: string = 'processed'
): Promise<{ path: string; key: string }> {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const newName = `${baseName}_${suffix}${ext}`;
  const key = `${userId}/output/${uuidv4()}_${newName}`;
  const filePath = path.join(UPLOAD_DIR, key);

  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, buffer);

  return { path: filePath, key };
}

export function getPublicUrl(key: string): string {
  return `/api/files/download/${encodeURIComponent(key)}`;
}
