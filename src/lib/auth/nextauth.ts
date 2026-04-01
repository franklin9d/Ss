import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/db/prisma';
import { verifyPassword } from './password';

// getAuthOptions – called per-request, safe for build time because
// prisma is a Proxy that only connects when actually used
export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
    providers: [
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          if (user.isBlocked) {
            throw new Error('Account has been suspended');
          }

          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan: user.plan,
            image: user.avatar,
          };
        },
      }),
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? [
            (() => {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const GoogleProvider = require('next-auth/providers/google').default;
              return GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                allowDangerousEmailAccountLinking: true,
              });
            })(),
          ]
        : []),
    ],
    session: {
      strategy: 'jwt' as const,
      maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        if (user) {
          token.userId = user.id;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          token.role = (user as any).role || 'USER';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          token.plan = (user as any).plan || 'FREE';
        }
        if (trigger === 'update' && session) {
          token.plan = session.plan;
          token.name = session.name;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session.user as any).id = token.userId;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session.user as any).role = token.role;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session.user as any).plan = token.plan;
        }
        return session;
      },
    },
    events: {
      async signIn({ user }) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN',
              details: { method: 'credentials' },
            },
          });
        } catch {
          // Don't block login if audit log fails
        }
      },
    },
  };
}
