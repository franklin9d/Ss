import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAuth, withRateLimit } from '@/lib/auth/middleware';
import {
  validateFileType,
  validateFileSize,
  isDangerousFile,
  scanFileForVirus,
} from '@/lib/security/validation';
import { processFile } from '@/lib/processing';
import { saveProcessedFile, getPublicUrl } from '@/lib/storage/local';
import type { FileOperation } from '@/types';

// Force dynamic rendering (uses DB, auth, file processing)
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = withRateLimit(req, { maxRequests: 30, windowMs: 60 * 1000 });
    if (rateLimitResult) return rateLimitResult;

    // Auth check
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // Check if user is blocked
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isBlocked: true, plan: true },
    });

    if (dbUser?.isBlocked) {
      return NextResponse.json(
        { success: false, error: 'Your account has been suspended' },
        { status: 403 }
      );
    }

    // Check daily usage limits
    const today = new Date(new Date().toISOString().split('T')[0]);
    const plan = (dbUser?.plan || 'FREE') as 'FREE' | 'PRO';

    if (plan === 'FREE') {
      const usage = await prisma.usage.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      });

      const dailyLimit = parseInt(process.env.FREE_DAILY_LIMIT || '5');
      if (usage && usage.count >= dailyLimit) {
        return NextResponse.json(
          {
            success: false,
            error: `Daily limit of ${dailyLimit} conversions reached. Upgrade to Pro for unlimited access.`,
          },
          { status: 429 }
        );
      }
    }

    // Parse multipart form data
    const formData = await req.formData();
    const operation = formData.get('operation') as FileOperation;
    const optionsStr = formData.get('options') as string;
    const files = formData.getAll('files') as File[];

    if (!operation) {
      return NextResponse.json(
        { success: false, error: 'Operation is required' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one file is required' },
        { status: 400 }
      );
    }

    // Validate each file
    const buffers: Buffer[] = [];
    const originalNames: string[] = [];

    for (const file of files) {
      // Dangerous file check
      if (isDangerousFile(file.name)) {
        return NextResponse.json(
          { success: false, error: `Dangerous file type detected: ${file.name}` },
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
      const sizeValidation = validateFileSize(file.size, plan);
      if (!sizeValidation.valid) {
        return NextResponse.json(
          { success: false, error: sizeValidation.error },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Virus scan
      const scanResult = await scanFileForVirus(buffer, file.name);
      if (!scanResult.safe) {
        return NextResponse.json(
          { success: false, error: `Security threat detected: ${scanResult.threat}` },
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

    // Create file record
    const fileRecord = await prisma.fileRecord.create({
      data: {
        userId: user.id,
        operation,
        status: 'PROCESSING',
        inputFileName: originalNames.join(', '),
        inputFileSize: BigInt(buffers.reduce((sum, b) => sum + b.length, 0)),
        inputFileType: files[0].type,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
      },
    });

    try {
      // Process the file
      const result = await processFile(operation, buffers, originalNames, options);

      // Save output
      const outputBuffer = Array.isArray(result.outputBuffer)
        ? result.outputBuffer[0]
        : result.outputBuffer;

      const saved = await saveProcessedFile(
        outputBuffer,
        result.outputFileName,
        user.id
      );

      // Update file record
      await prisma.fileRecord.update({
        where: { id: fileRecord.id },
        data: {
          status: 'COMPLETED',
          outputFileName: result.outputFileName,
          outputFileSize: BigInt(outputBuffer.length),
          outputFileType: result.outputMimeType,
          outputPath: saved.key,
          downloadUrl: getPublicUrl(saved.key),
          processingTime: result.processingTime,
        },
      });

      // Update usage
      await prisma.usage.upsert({
        where: { userId_date: { userId: user.id, date: today } },
        update: {
          count: { increment: 1 },
          bytesUsed: { increment: BigInt(outputBuffer.length) },
        },
        create: {
          userId: user.id,
          date: today,
          count: 1,
          bytesUsed: BigInt(outputBuffer.length),
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'FILE_PROCESS',
          details: {
            operation,
            inputFiles: originalNames,
            outputFile: result.outputFileName,
            processingTime: result.processingTime,
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          id: fileRecord.id,
          operation,
          outputFileName: result.outputFileName,
          outputFileSize: outputBuffer.length,
          downloadUrl: getPublicUrl(saved.key),
          processingTime: result.processingTime,
        },
      });
    } catch (processingError) {
      // Update file record with error
      await prisma.fileRecord.update({
        where: { id: fileRecord.id },
        data: {
          status: 'FAILED',
          errorMessage:
            processingError instanceof Error
              ? processingError.message
              : 'Processing failed',
        },
      });

      throw processingError;
    }
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'File processing failed',
      },
      { status: 500 }
    );
  }
}
