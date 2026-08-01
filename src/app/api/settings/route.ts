import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireRole } from "@/lib/rbac";

export async function GET(request: Request) {
  await requireRole("super_admin", "admin");
  const rows = await db.select().from(settings);
  const map: Record<string, unknown> = {};
  for (const s of rows) {
    map[s.key] = s.value;
  }
  return NextResponse.json({ data: map });
}

export async function POST(request: Request) {
  await requireRole("super_admin", "admin");
  const body = await request.json();

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const ALLOWED_KEYS = [
    "site.name",
    "site.description",
    "site.phone",
    "site.email",
    "site.address",
    "site.whatsapp",
    "site.social.instagram",
    "site.social.facebook",
    "site.social.youtube",
    "site.tiktok",
  ];

  const updates = [];
  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.includes(key)) continue;
    updates.push(
      db
        .insert(settings)
        .values({ key, value: value as object })
        .onConflictDoUpdate({ target: settings.key, set: { value: value as object, updatedAt: new Date() } })
    );
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "Tidak ada pengaturan valid" }, { status: 400 });
  }

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}
