import { NextResponse } from "next/server";
import { eq, like, desc, asc, count } from "drizzle-orm";

import { db } from "@/db";
import { faqs } from "@/db/schema";
import { faqSchema } from "@/lib/validations";
import { getPaginationState, validateBody } from "@/lib/api/crud";

function sortColumn(sort?: string) {
  switch (sort) {
    case "question":
      return faqs.question;
    default:
      return faqs.createdAt;
  }
}

export async function GET(request: Request) {
  const state = getPaginationState(request);
  const order = state.dir === "asc" ? asc(sortColumn(state.sort)) : desc(sortColumn(state.sort));

  const q = db.select().from(faqs);
  const query = state.search ? q.where(like(faqs.question, `%${state.search}%`)) : q;

  const rows = await query.orderBy(order).limit(state.limit).offset((state.page - 1) * state.limit);

  const totalRes = await db.select({ count: count() }).from(faqs);
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
  const result = validateBody(faqSchema, body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  const rows = await db.insert(faqs).values(result.data).returning();
  return NextResponse.json(rows[0], { status: 201 });
}
