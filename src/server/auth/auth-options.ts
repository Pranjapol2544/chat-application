import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { loginSchema } from '@/features/auth/schemas/login.schema';
import { prisma } from '@/server/db/prisma';
import { verifyPassword } from '@/server/auth/password';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: result.data.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await verifyPassword(result.data.password, user.passwordHash);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.username,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username =
          'username' in user && typeof user.username === 'string'
            ? user.username
            : (user.name ?? '');
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === 'string' ? token.id : (token.sub ?? '');
        session.user.username = typeof token.username === 'string' ? token.username : '';
      }

      return session;
    },
  },
};
