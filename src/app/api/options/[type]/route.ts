import { NextResponse } from "next/server";
import { eq, and, asc, isNull } from "drizzle-orm";

import { db } from "@/db";
import { users, countries, roles, jobCategories } from "@/db/schema";
import { requireRole } from "@/lib/rbac";

interface Option {
  value: string;
  label: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  await requireRole("super_admin", "admin", "staff");
  const { type } = await params;

  let data: Option[] = [];

  switch (type) {
    case "users": {
      const rows = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(and(eq(users.status, "active"), isNull(users.deletedAt)))
        .orderBy(asc(users.name));
      data = rows.map((u) => ({
        value: u.id,
        label: u.email ? `${u.name} (${u.email})` : u.name,
      }));
      break;
    }
    case "countries": {
      const rows = await db
        .select({ id: countries.id, name: countries.name })
        .from(countries)
        .where(eq(countries.isActive, true))
        .orderBy(asc(countries.name));
      data = rows.map((c) => ({ value: c.id, label: c.name }));
      break;
    }
    case "roles": {
      const rows = await db
        .select({ id: roles.id, name: roles.name })
        .from(roles)
        .orderBy(asc(roles.name));
      data = rows.map((r) => ({ value: r.id, label: r.name }));
      break;
    }
    case "job-categories": {
      const rows = await db
        .select({ id: jobCategories.id, name: jobCategories.name })
        .from(jobCategories)
        .where(eq(jobCategories.isActive, true))
        .orderBy(asc(jobCategories.name));
      data = rows.map((c) => ({ value: c.id, label: c.name }));
      break;
    }
    default:
      return NextResponse.json({ error: "Tipe opsi tidak dikenal" }, { status: 400 });
  }

  return NextResponse.json({ data });
}
