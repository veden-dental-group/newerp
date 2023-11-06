import bcrypt from "bcrypt";
import type { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const dummyDatabase = async (username: string) => {
  if (username !== "dev@veden.dental") return "This is not valid";

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash("veden1010", salt);
};

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "User Name",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const { username, password } = credentials;

        const user: User = {
          id: "1",
          email: "dev@veden.dental",
          name: "admin",
        };

        const passwordQueryFromDatabase = await dummyDatabase(username);

        const isMatch = await bcrypt.compare(
          password,
          passwordQueryFromDatabase
        );
        if (!isMatch) return null;

        return { ...user };
      },
    }),
  ],
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ user, token }) {
      if (!user) return token;

      return { ...token, ...user };
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user = { ...session.user, ...token };
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
