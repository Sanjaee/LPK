import { NextResponse } from "next/server";
import { like, desc, asc, count } from "drizzle-orm";

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
