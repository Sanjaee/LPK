import { NextResponse } from "next/server";
import { eq, desc, asc, count, like } from "drizzle-orm";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireRole } from "@/lib/rbac";
import { getPaginationState } from "@/lib/api/crud";

function sortColumn(sort?: string) {
  switch (sort) {
    case "name":
      return contactMessages.name;
    case "email":
      return contactMessages.email;
    default:
      return contactMessages.createdAt;
  }
}

export async function GET(request: Request) {
  await requireRole("super_admin", "admin", "staff");

  const state = getPaginationState(request);
  const order = state.dir === "asc" ? asc(sortColumn(state.sort)) : desc(sortColumn(state.sort));

  const q = db.select().from(contactMessages);
  const query = state.search ? q.where(like(contactMessages.name, `%${state.search}%`)) : q;

  const rows = await query.orderBy(order).limit(state.limit).offset((state.page - 1) * state.limit);

  const totalRes = await db.select({ count: count() }).from(contactMessages);
  const total = Number(totalRes[0]?.count ?? 0);

  return NextResponse.json({
    data: rows,
    page: state.page,
    limit: state.limit,
    total,
    pageCount: Math.ceil(total / state.limit),
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole("super_admin", "admin", "staff");
  const { id } = await params;
  const body = await request.json();

  if (typeof body.isRead !== "boolean") {
    return NextResponse.json({ error: "isRead diperlukan" }, { status: 400 });
  }

  const rows = await db
    .update(contactMessages)
    .set({ isRead: body.isRead })
    .where(eq(contactMessages.id, id))
    .returning();
  if (!rows.length) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole("super_admin", "admin");
  const { id } = await params;
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  return NextResponse.json({ success: true });
}
