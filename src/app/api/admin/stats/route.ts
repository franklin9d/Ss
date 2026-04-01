import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/middleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    const [
      totalUsers,
      proUsers,
      totalFiles,
      totalPayments,
      recentActivity,
      last30DaysUsers,
      last30DaysFiles,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: 'PRO' } }),
      prisma.fileRecord.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'succeeded' },
      }),
      prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: true,
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.fileRecord.groupBy({
        by: ['createdAt'],
        _count: true,
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        proUsers,
        totalFiles,
        totalRevenue: (totalPayments._sum.amount || 0) / 100,
        recentActivity: recentActivity.map((log) => ({
          id: log.id,
          action: log.action,
          userId: log.userId,
          userName: log.user?.name || log.user?.email || 'Unknown',
          details: JSON.stringify(log.details),
          createdAt: log.createdAt.toISOString(),
        })),
        conversionRate:
          totalUsers > 0
            ? ((proUsers / totalUsers) * 100).toFixed(1)
            : '0',
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
