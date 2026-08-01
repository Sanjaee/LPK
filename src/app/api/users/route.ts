import { NextResponse } from "next/server";
import { eq, like, desc, asc, count } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { userSchema } from "@/lib/validations";
import { getPaginationState, validateBody } from "@/lib/api/crud";

function sortColumn(sort?: string) {
  switch (sort) {
    case "name":
      return users.name;
    case "email":
      return users.email;
    case "status":
      return users.status;
    default:
      return users.createdAt;
  }
}

export async function GET(request: Request) {
  const state = getPaginationState(request);
  const order = state.dir === "asc" ? asc(sortColumn(state.sort)) : desc(sortColumn(state.sort));

  const q = db.select().from(users);
  const query = state.search ? q.where(like(users.name, `%${state.search}%`)) : q;

  const rows = await query.orderBy(order).limit(state.limit).offset((state.page - 1) * state.limit);

  const totalRes = await db.select({ count: count() }).from(users);
  const total = Number(totalRes[0]?.count ?? 0);

  return NextResponse.json({
    data: rows,
    page: state.page,
    limit: state.limit,
    total,
    pageCount: Math.ceil(total / state.limit),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = validateBody(userSchema, body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const rows = await db
    .insert(users)
    .values({ ...result.data, password: result.data.password ?? "", updatedAt: new Date() })
    .returning();
  return NextResponse.json(rows[0], { status: 201 });
}
