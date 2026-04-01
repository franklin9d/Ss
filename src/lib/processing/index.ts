import { imageToPdf, textToPdf, mergePdfs, splitPdf, compressPdf } from './pdf';
import { convertImage, resizeImage, compressImage, ImageFormat } from './images';
import { markdownToPdf, wordToPdf } from './documents';
import { createZip, extractZip } from './archive';
import { performOcr } from './ocr';
import type { FileOperation } from '@/types';

// ============================================
// UNIFIED FILE PROCESSOR
// ============================================

export interface ProcessingResult {
  outputBuffer: Buffer | Buffer[];
  outputFileName: string;
  outputMimeType: string;
  processingTime: number;
}

export async function processFile(
  operation: FileOperation,
  buffers: Buffer[],
  originalNames: string[],
  options: Record<string, unknown> = {}
): Promise<ProcessingResult> {
  const startTime = Date.now();
  let outputBuffer: Buffer | Buffer[];
  let outputFileName: string;
  let outputMimeType: string;

  switch (operation) {
    case 'IMAGE_TO_PDF': {
      outputBuffer = await imageToPdf(buffers);
      outputFileName = 'converted.pdf';
      outputMimeType = 'application/pdf';
      break;
    }

    case 'TEXT_TO_PDF': {
      const text = buffers[0].toString('utf-8');
      outputBuffer = await textToPdf(text, {
        fontSize: (options.fontSize as number) || 12,
        title: options.title as string,
      });
      outputFileName = 'document.pdf';
      outputMimeType = 'application/pdf';
      break;
    }

    case 'MERGE_PDF': {
      outputBuffer = await mergePdfs(buffers);
      outputFileName = 'merged.pdf';
      outputMimeType = 'application/pdf';
      break;
    }

    case 'SPLIT_PDF': {
      const pages = await splitPdf(buffers[0], {
        pageRange: options.pageRange as string,
      });
      if (pages.length === 1) {
        outputBuffer = pages[0];
        outputFileName = 'split_page.pdf';
      } else {
        outputBuffer = await createZip(
          pages.map((p, i) => ({
            name: `page_${i + 1}.pdf`,
            buffer: p,
          }))
        );
        outputFileName = 'split_pages.zip';
      }
      outputMimeType = pages.length === 1 ? 'application/pdf' : 'application/zip';
      break;
    }

    case 'COMPRESS_PDF': {
      outputBuffer = await compressPdf(buffers[0]);
      outputFileName = `${originalNames[0]?.replace('.pdf', '')}_compressed.pdf`;
      outputMimeType = 'application/pdf';
      break;
    }

    case 'IMAGE_CONVERT': {
      const format = (options.format as ImageFormat) || 'png';
      outputBuffer = await convertImage(
        buffers[0],
        format,
        options.quality as number
      );
      outputFileName = `converted.${format}`;
      outputMimeType = `image/${format}`;
      break;
    }

    case 'IMAGE_RESIZE': {
      outputBuffer = await resizeImage(buffers[0], {
        width: options.width as number,
        height: options.height as number,
        fit: options.fit as 'cover' | 'contain' | 'fill' | 'inside' | 'outside',
        format: options.format as ImageFormat,
      });
      const ext = (options.format as string) || 'png';
      outputFileName = `resized.${ext}`;
      outputMimeType = `image/${ext}`;
      break;
    }

    case 'IMAGE_COMPRESS': {
      outputBuffer = await compressImage(
        buffers[0],
        (options.quality as number) || 70
      );
      outputFileName = `${originalNames[0]?.replace(/\.[^.]+$/, '')}_compressed.jpg`;
      outputMimeType = 'image/jpeg';
      break;
    }

    case 'WORD_TO_PDF': {
      outputBuffer = await wordToPdf(buffers[0]);
      outputFileName = `${originalNames[0]?.replace(/\.[^.]+$/, '')}.pdf`;
      outputMimeType = 'application/pdf';
      break;
    }

    case 'MARKDOWN_TO_PDF': {
      const md = buffers[0].toString('utf-8');
      outputBuffer = await markdownToPdf(md);
      outputFileName = `${originalNames[0]?.replace(/\.[^.]+$/, '')}.pdf`;
      outputMimeType = 'application/pdf';
      break;
    }

    case 'ZIP_CREATE': {
      const files = buffers.map((buf, i) => ({
        name: originalNames[i] || `file_${i}`,
        buffer: buf,
      }));
      outputBuffer = await createZip(files);
      outputFileName = 'archive.zip';
      outputMimeType = 'application/zip';
      break;
    }

    case 'ZIP_EXTRACT': {
      const extracted = await extractZip(buffers[0]);
      if (extracted.length === 1) {
        outputBuffer = extracted[0].buffer;
        outputFileName = extracted[0].name;
        outputMimeType = 'application/octet-stream';
      } else {
        outputBuffer = await createZip(extracted);
        outputFileName = 'extracted.zip';
        outputMimeType = 'application/zip';
      }
      break;
    }

    case 'OCR': {
      const result = await performOcr(buffers[0]);
      outputBuffer = Buffer.from(
        JSON.stringify({
          text: result.text,
          confidence: result.confidence,
        }),
        'utf-8'
      );
      outputFileName = 'ocr_result.json';
      outputMimeType = 'application/json';
      break;
    }

    case 'VIDEO_CONVERT':
    case 'AUDIO_EXTRACT': {
      // These require ffmpeg - return placeholder
      outputBuffer = Buffer.from('Media processing requires ffmpeg. Install it for full functionality.');
      outputFileName = 'notice.txt';
      outputMimeType = 'text/plain';
      break;
    }

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }

  const processingTime = Date.now() - startTime;

  return {
    outputBuffer,
    outputFileName,
    outputMimeType,
    processingTime,
  };
}
