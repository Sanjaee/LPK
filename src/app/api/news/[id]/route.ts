import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { news } from "@/db/schema";
import { newsSchema } from "@/lib/validations";
import { validateBody } from "@/lib/api/crud";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = validateBody(newsSchema.partial(), body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const rows = await db.update(news).set({ ...result.data, updatedAt: new Date() }).where(eq(news.id, id)).returning();
  if (!rows.length) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(news).where(eq(news.id, id));
  return NextResponse.json({ success: true });
}
