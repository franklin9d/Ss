import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      prisma.fileRecord.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          operation: true,
          status: true,
          inputFileName: true,
          inputFileSize: true,
          outputFileName: true,
          outputFileSize: true,
          downloadUrl: true,
          processingTime: true,
          createdAt: true,
          expiresAt: true,
        },
      }),
      prisma.fileRecord.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      success: true,
      data: files.map((f) => ({
        ...f,
        inputFileSize: Number(f.inputFileSize),
        outputFileSize: f.outputFileSize ? Number(f.outputFileSize) : null,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('File history error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
