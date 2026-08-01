import "server-only";
import { NextResponse } from "next/server";
import type { ZodSchema, z } from "zod";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  pageCount: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  dir?: "asc" | "desc";
}

export function getPaginationState(request: Request): PaginationState {
  const url = new URL(request.url);
  return {
    page: Math.max(1, Number(url.searchParams.get("page")) || 1),
    limit: Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 10)),
    search: url.searchParams.get("search") ?? undefined,
    sort: url.searchParams.get("sort") ?? "createdAt",
    dir: (url.searchParams.get("dir") as "asc" | "desc") ?? "desc",
  };
}

export async function paginateQuery(
  query: any,
  totalQuery: any,
  state: PaginationState
): Promise<PaginatedResult<any>> {
  const offset = (state.page - 1) * state.limit;
  const rows = await query.limit(state.limit).offset(offset);

  const totalRes = await totalQuery;
  const total = Number(totalRes[0]?.count ?? 0);

  return {
    data: rows,
    page: state.page,
    limit: state.limit,
    total,
    pageCount: Math.ceil(total / state.limit),
  };
}

export function validateBody<T extends ZodSchema<any, any, any>>(
  schema: T,
  body: unknown
): { ok: true; data: z.infer<T> } | { ok: false; error: string } {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  return { ok: true as const, data: parsed.data };
}

export { sql };
