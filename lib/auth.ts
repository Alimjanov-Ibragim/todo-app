import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/prisma/client';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com'
        },
        password: { label: 'Пароль', type: 'password' }
      },
      // @ts-expect-error @types/next-auth
      async authorize(
        credentials: { email: string; password: string } | undefined
      ) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('Email и пароль обязательны');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error('Пользователь не найден');
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Неверный пароль');
        }

        return { id: user.id, name: user.name, email: user.email };
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: number }).id = token.id as number;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET as string
};
