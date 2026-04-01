import sharp from 'sharp';

// ============================================
// IMAGE PROCESSING SERVICE
// ============================================

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'tiff' | 'avif';

export async function convertImage(
  buffer: Buffer,
  targetFormat: ImageFormat,
  quality?: number
): Promise<Buffer> {
  let pipeline = sharp(buffer);

  switch (targetFormat) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality: quality || 85 });
      break;
    case 'png':
      pipeline = pipeline.png({ quality: quality || 90 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality: quality || 85 });
      break;
    case 'gif':
      pipeline = pipeline.gif();
      break;
    case 'tiff':
      pipeline = pipeline.tiff({ quality: quality || 85 });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality: quality || 65 });
      break;
  }

  return pipeline.toBuffer();
}

export async function resizeImage(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    format?: ImageFormat;
  }
): Promise<Buffer> {
  let pipeline = sharp(buffer).resize({
    width: options.width,
    height: options.height,
    fit: options.fit || 'inside',
    withoutEnlargement: true,
  });

  if (options.format) {
    pipeline = pipeline.toFormat(options.format);
  }

  return pipeline.toBuffer();
}

export async function compressImage(
  buffer: Buffer,
  quality: number = 70
): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata();
  const format = metadata.format || 'jpeg';

  let pipeline = sharp(buffer);

  switch (format) {
    case 'jpeg':
    case 'jpg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    default:
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  }

  return pipeline.toBuffer();
}

export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata();
}
