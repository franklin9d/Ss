import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/security/rate-limit';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  plan: string;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return null;

  return {
    id: token.userId as string,
    email: token.email as string,
    role: (token.role as string) || 'USER',
    plan: (token.plan as string) || 'FREE',
  };
}

export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  return { user };
}

export async function requireAdmin(
  req: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;

  if (result.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 }
    );
  }

  return result;
}

export function withRateLimit(
  req: NextRequest,
  config?: { windowMs?: number; maxRequests?: number }
): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const result = checkRateLimit(`api:${ip}`, {
    windowMs: config?.windowMs || 15 * 60 * 1000,
    maxRequests: config?.maxRequests || 100,
  });

  if (!result.allowed) {
    const headers = getRateLimitHeaders(result);
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers }
    );
  }

  return null;
}
