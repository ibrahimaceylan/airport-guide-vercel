import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { Role } from "./roles";
import bcrypt from "bcryptjs";

type UserWithRole = {
  role?: Role;
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
type SessionUser = Mutable<NonNullable<Session["user"]>>;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: String(user.id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as UserWithRole).role;
      return token;
    },
    async session({ session, token }) {
      const user = session?.user as SessionUser | undefined;
      if (user) {
        user.role = token.role as Role | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-next-auth-secret",
};

const { auth } = NextAuth(authOptions);

export { auth };
