import NextAuth from 'next-auth';
import { OPTIONS } from './authOptions';

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
