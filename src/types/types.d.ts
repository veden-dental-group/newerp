import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';
import { NextAuthUser } from '@/types/shared.types';
import { User as PrismaUser } from '@/lib/prisma';

declare module 'next-auth' {
  interface Session {
    user: NextAuthUser & DefaultSession;
  }

  interface User extends DefaultUser, NextAuthUser, PrismaUser {}
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT, NextAuthUser {}
}
