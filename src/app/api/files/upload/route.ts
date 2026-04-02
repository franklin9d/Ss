import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/auth/middleware';
import {
  validateFileType,
  isDangerousFile,
  scanFileForVirus,
} from '@/lib/security/validation';
import { processFile } from '@/lib/processing';
import { saveProcessedFile, getPublicUrl } from '@/lib/storage/local';
import type { FileOperation } from '@/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (generous: 60 requests per minute)
    const rateLimitResult = withRateLimit(req, { maxRequests: 60, windowMs: 60 * 1000 });
    if (rateLimitResult) return rateLimitResult;

    // No auth required - free for everyone

    // Parse multipart form data
    const formData = await req.formData();
    const operation = formData.get('operation') as FileOperation;
    const optionsStr = formData.get('options') as string;
    const files = formData.getAll('files') as File[];

    if (!operation) {
      return NextResponse.json(
        { success: false, error: 'العملية مطلوبة' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'يجب اختيار ملف واحد على الأقل' },
        { status: 400 }
      );
    }

    // Validate each file
    const buffers: Buffer[] = [];
    const originalNames: string[] = [];
    const maxSize = 100 * 1024 * 1024; // 100MB for everyone

    for (const file of files) {
      // Dangerous file check
      if (isDangerousFile(file.name)) {
        return NextResponse.json(
          { success: false, error: `نوع ملف خطير تم اكتشافه: ${file.name}` },
          { status: 400 }
        );
      }

      // File type validation
      const typeValidation = validateFileType(file.name, file.type, operation);
      if (!typeValidation.valid) {
        return NextResponse.json(
          { success: false, error: typeValidation.error },
          { status: 400 }
        );
      }

      // File size validation
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: `حجم الملف يتجاوز الحد الأقصى 100 ميجابايت` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Virus scan
      const scanResult = await scanFileForVirus(buffer, file.name);
      if (!scanResult.safe) {
        return NextResponse.json(
          { success: false, error: `تم اكتشاف تهديد أمني: ${scanResult.threat}` },
          { status: 400 }
        );
      }

      buffers.push(buffer);
      originalNames.push(file.name);
    }

    // Parse options
    let options: Record<string, unknown> = {};
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch {
        // Ignore invalid options
      }
    }

    // Process the file
    const result = await processFile(operation, buffers, originalNames, options);

    // Save output
    const outputBuffer = Array.isArray(result.outputBuffer)
      ? result.outputBuffer[0]
      : result.outputBuffer;

    const saved = await saveProcessedFile(
      outputBuffer,
      result.outputFileName,
      'anonymous'
    );

    return NextResponse.json({
      success: true,
      data: {
        id: 'free-' + Date.now(),
        operation,
        outputFileName: result.outputFileName,
        outputFileSize: outputBuffer.length,
        downloadUrl: getPublicUrl(saved.key),
        processingTime: result.processingTime,
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'فشلت معالجة الملف',
      },
      { status: 500 }
    );
  }
}
