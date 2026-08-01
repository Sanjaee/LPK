import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { eq } from "drizzle-orm";
import type { Session } from "next-auth";

import { auth } from "@/auth";
import { db } from "@/db";
import { permissions, rolePermissions, roles } from "@/db/schema";

export type SessionUser = Session["user"] | null;

export const getSession = cache(async (): Promise<Session | null> => {
  const session = await auth();
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

export const getRoleBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(roles)
    .where(eq(roles.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export const getRoleById = cache(async (id: string) => {
  const rows = await db
    .select()
    .from(roles)
    .where(eq(roles.id, id))
    .limit(1);
  return rows[0] ?? null;
});

export async function getUserPermissions(
  roleId: string | null | undefined
): Promise<string[]> {
  if (!roleId) return [];
  const rows = await db
    .select({ slug: permissions.slug })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));
  return rows.map((r) => r.slug);
}

export async function requireUser(): Promise<NonNullable<SessionUser>> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requirePermission(
  permission: string
): Promise<NonNullable<SessionUser>> {
  const user = await requireUser();
  const perms = await getUserPermissions(user.roleId);
  if (!perms.includes(permission)) {
    redirect("/dashboard");
  }
  return user;
}

export async function requireRole(
  ...slugs: string[]
): Promise<NonNullable<SessionUser>> {
  const user = await requireUser();
  const role = user.roleId ? await getRoleById(user.roleId) : null;
  if (!role || !slugs.includes(role.slug)) {
    redirect("/dashboard");
  }
  return user;
}
