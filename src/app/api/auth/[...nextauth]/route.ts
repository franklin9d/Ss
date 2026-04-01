import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth/nextauth';

export const dynamic = 'force-dynamic';

// Build handler at request time, not at build time
const handler = (...args: Parameters<ReturnType<typeof NextAuth>>) => {
  return NextAuth(getAuthOptions())(...args);
};

export { handler as GET, handler as POST };
