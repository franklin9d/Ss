import archiver from 'archiver';
import unzipper from 'unzipper';
import { Readable, PassThrough } from 'stream';

// ============================================
// ARCHIVE PROCESSING SERVICE
// ============================================

export async function createZip(
  files: { name: string; buffer: Buffer }[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const passthrough = new PassThrough();

    passthrough.on('data', (chunk: Buffer) => chunks.push(chunk));
    passthrough.on('end', () => resolve(Buffer.concat(chunks)));
    passthrough.on('error', reject);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(passthrough);

    for (const file of files) {
      archive.append(file.buffer, { name: file.name });
    }

    archive.finalize();
  });
}

export async function extractZip(
  zipBuffer: Buffer
): Promise<{ name: string; buffer: Buffer }[]> {
  const files: { name: string; buffer: Buffer }[] = [];
  const stream = Readable.from(zipBuffer);
  
  const directory = stream.pipe(unzipper.Parse({ forceStream: true }));
  
  for await (const entry of directory) {
    const typedEntry = entry as unzipper.Entry;
    if (typedEntry.type === 'File') {
      const chunks: Buffer[] = [];
      for await (const chunk of typedEntry) {
        chunks.push(chunk as Buffer);
      }
      files.push({
        name: typedEntry.path,
        buffer: Buffer.concat(chunks),
      });
    } else {
      typedEntry.autodrain();
    }
  }

  return files;
}
