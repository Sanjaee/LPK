import "server-only";

import { count, gte, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  applicants,
  users,
  countries,
  programs,
  news,
  contactMessages,
} from "@/db/schema";

export async function getDashboardStats() {
  const [applicantCount, userCount, countryCount, programCount, newsCount, messageCount] =
    await Promise.all([
      db.select({ value: count() }).from(applicants),
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(countries),
      db.select({ value: count() }).from(programs),
      db.select({ value: count() }).from(news),
      db.select({ value: count() }).from(contactMessages),
    ]);

  const statusCounts = await db
    .select({
      status: applicants.status,
      count: count(),
    })
    .from(applicants)
    .groupBy(applicants.status);

  const thisMonth = new Date();
  thisMonth.setDate(1);

  const monthlyApplicants = await db
    .select({
      month: sql<string>`to_char(${applicants.createdAt}, 'YYYY-MM')`,
      count: count(),
    })
    .from(applicants)
    .where(gte(applicants.createdAt, thisMonth))
    .groupBy(sql`to_char(${applicants.createdAt}, 'YYYY-MM')`);

  return {
    applicantCount: applicantCount[0]?.value ?? 0,
    userCount: userCount[0]?.value ?? 0,
    countryCount: countryCount[0]?.value ?? 0,
    programCount: programCount[0]?.value ?? 0,
    newsCount: newsCount[0]?.value ?? 0,
    messageCount: messageCount[0]?.value ?? 0,
    statusCounts,
    monthlyApplicants,
  };
}

export async function getDashboardRecentApplicants(limit = 5) {
  const rows = await db
    .select({
      id: applicants.id,
      fullName: applicants.fullName,
      email: applicants.email,
      status: applicants.status,
      createdAt: applicants.createdAt,
    })
    .from(applicants)
    .where(isNull(applicants.deletedAt))
    .orderBy(sql`${applicants.createdAt} desc`)
    .limit(limit);
  return rows;
}
