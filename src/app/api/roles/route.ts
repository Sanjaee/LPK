import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { roles, permissions, rolePermissions } from "@/db/schema";
import { requireRole } from "@/lib/rbac";

export async function GET(request: Request) {
  await requireRole("super_admin", "admin");

  const rolesList = await db.select().from(roles).orderBy(roles.createdAt);
  const permsList = await db.select().from(permissions).orderBy(permissions.module);

  // Map of roleId -> permission slugs
  const rpRows = await db.select().from(rolePermissions);
  const rolePerms: Record<string, string[]> = {};
  for (const rp of rpRows) {
    if (!rolePerms[rp.roleId]) rolePerms[rp.roleId] = [];
    rolePerms[rp.roleId].push(rp.permissionId);
  }

  const permSlugs: Record<string, string> = {};
  for (const p of permsList) {
    permSlugs[p.id] = p.slug;
  }

  const rolesWithPerms = rolesList.map((r) => ({
    ...r,
    permissions: (rolePerms[r.id] ?? []).map((pid) => permSlugs[pid]).filter(Boolean),
  }));

  return NextResponse.json({ roles: rolesWithPerms, permissions: permsList });
}

export async function PATCH(request: Request) {
  await requireRole("super_admin", "admin");
  const body = await request.json();
  const { roleId, permissionSlugs } = body as { roleId?: string; permissionSlugs?: string[] };

  if (!roleId || !Array.isArray(permissionSlugs)) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const role = await db.select().from(roles).where(eq(roles.id, roleId)).then((r) => r[0]);
  if (!role) {
    return NextResponse.json({ error: "Role tidak ditemukan" }, { status: 404 });
  }

  // Delete existing mappings
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId));

  // Insert new mappings
  const allPerms = await db.select().from(permissions);
  const slugToId: Record<string, string> = {};
  for (const p of allPerms) slugToId[p.slug] = p.id;

  const validIds = permissionSlugs
    .map((slug) => slugToId[slug])
    .filter((id): id is string => Boolean(id));

  if (validIds.length > 0) {
    await db.insert(rolePermissions).values(validIds.map((permissionId) => ({ roleId, permissionId })));
  }

  return NextResponse.json({ success: true });
}
