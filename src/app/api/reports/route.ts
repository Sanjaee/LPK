import { NextResponse } from "next/server";
import { eq, and, gte, lt, inArray } from "drizzle-orm";

import { db } from "@/db";
import { applicants, programs, countries } from "@/db/schema";
import { requireRole } from "@/lib/rbac";

export async function GET(request: Request) {
  await requireRole("super_admin", "admin", "staff");

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Base applicant query
  const baseQuery = db.select().from(applicants);

  let fromDate: Date | null = null;
  let toDate: Date | null = null;
  if (from && to) {
    fromDate = new Date(from);
    toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);
  }

  const applicantQuery =
    fromDate && toDate
      ? baseQuery.where(
          and(
            gte(applicants.createdAt, fromDate),
            lt(applicants.createdAt, toDate)
          )
        )
      : baseQuery;

  const allApplicants = await applicantQuery;

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  for (const a of allApplicants) {
    statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1;
  }

  // Program breakdown
  const programIds = [...new Set(allApplicants.map((a) => a.programId).filter(Boolean))] as string[];
  const programsList = programIds.length
    ? await db.select().from(programs).where(inArray(programs.id, programIds))
    : [];

  // Country breakdown via programs
  const programCountryIds = [...new Set(programsList.map((p) => p.countryId).filter(Boolean))] as string[];
  const countriesList = programCountryIds.length
    ? await db.select().from(countries).where(inArray(countries.id, programCountryIds))
    : [];

  const programCounts = allApplicants.reduce<Record<string, number>>((acc, a) => {
    if (a.programId) acc[a.programId] = (acc[a.programId] ?? 0) + 1;
    return acc;
  }, {});

  const programBreakdown = programsList.map((p) => ({
    name: p.name,
    count: programCounts[p.id] ?? 0,
  }));

  // Gender breakdown
  const genderCounts = allApplicants.reduce<Record<string, number>>((acc, a) => {
    if (a.gender) acc[a.gender] = (acc[a.gender] ?? 0) + 1;
    return acc;
  }, {});

  // Monthly submissions (last 6 months)
  const monthly: { month: string; count: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toISOString().slice(0, 7);
    monthly.push({
      month: monthKey,
      count: allApplicants.filter(
        (a) => new Date(a.createdAt).toISOString().slice(0, 7) === monthKey
      ).length,
    });
  }

  return NextResponse.json({
    total: allApplicants.length,
    statusCounts,
    programBreakdown,
    genderCounts,
    monthly,
    countries: countriesList.map((c) => c.name),
    from,
    to,
  });
}
