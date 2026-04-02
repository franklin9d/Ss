import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers only - no auth protection
  const response = NextResponse.next();
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Redirect old login/register pages to home
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.redirect(new URL('/tools', request.url));
  }

  // Redirect pricing to home (everything is free)
  if (pathname === '/pricing') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tools/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/pricing',
  ],
};
