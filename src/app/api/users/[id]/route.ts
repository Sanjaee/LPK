import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { userSchema } from "@/lib/validations";
import { validateBody } from "@/lib/api/crud";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const result = validateBody(userSchema.partial(), body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const rows = await db
    .update(users)
    .set({ ...result.data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  if (!rows.length) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(users).where(eq(users.id, id));
  return NextResponse.json({ success: true });
}
