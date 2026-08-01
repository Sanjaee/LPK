import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    roleId?: string | null;
    status?: string | null;
    emailVerifiedAt?: Date | null;
  }

  interface Session {
    user: {
      id: string;
      roleId: string | null;
      status: string;
      emailVerifiedAt: Date | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roleId?: string | null;
    status?: string | null;
    emailVerifiedAt?: Date | null;
  }
}
