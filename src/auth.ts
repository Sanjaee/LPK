import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "@/db";
import { users } from "@/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const result = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const user = result[0];
        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          roleId: user.roleId,
          status: user.status,
          emailVerifiedAt: user.emailVerifiedAt,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.roleId = user.roleId as string | null | undefined;
        token.status = user.status as string | null | undefined;
        token.emailVerifiedAt = user.emailVerifiedAt as Date | null | undefined;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.roleId = (token.roleId as string | null) ?? null;
        session.user.status = (token.status as string | null) ?? "active";
        session.user.emailVerifiedAt =
          (token.emailVerifiedAt as Date | null) ?? null;
      }
      return session;
    },
  },
});
