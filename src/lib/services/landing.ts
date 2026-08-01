import "server-only";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  countries,
  jobCategories,
  programs,
  companies,
  banners,
  galleries,
  news,
  testimonials,
  faqs,
} from "@/db/schema";

export async function getLandingData() {
  const [
    bannerRows,
    countryRows,
    categoryRows,
    programRows,
    companyRows,
    galleryRows,
    newsRows,
    testimonialRows,
    faqRows,
  ] = await Promise.all([
    db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(banners.sortOrder),
    db
      .select()
      .from(countries)
      .where(eq(countries.isActive, true))
      .orderBy(countries.sortOrder),
    db
      .select()
      .from(jobCategories)
      .where(eq(jobCategories.isActive, true))
      .orderBy(jobCategories.name),
    db
      .select()
      .from(programs)
      .where(eq(programs.isActive, true))
      .orderBy(programs.sortOrder),
    db
      .select()
      .from(companies)
      .where(eq(companies.isActive, true)),
    db
      .select()
      .from(galleries)
      .where(eq(galleries.isActive, true))
      .orderBy(galleries.sortOrder),
    db
      .select()
      .from(news)
      .where(eq(news.status, "published"))
      .orderBy(sql`${news.publishedAt} desc`),
    db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isActive, true))
      .orderBy(testimonials.sortOrder),
    db
      .select()
      .from(faqs)
      .where(eq(faqs.isActive, true))
      .orderBy(faqs.sortOrder),
  ]);

  return {
    banners: bannerRows,
    countries: countryRows,
    categories: categoryRows,
    programs: programRows,
    companies: companyRows,
    galleries: galleryRows,
    news: newsRows,
    testimonials: testimonialRows,
    faqs: faqRows.slice(0, 5),
  };
}

export async function getFeaturedPrograms(limit = 3) {
  const rows = await db
    .select()
    .from(programs)
    .where(eq(programs.isFeatured, true))
    .orderBy(programs.sortOrder)
    .limit(limit);
  return rows;
}

export async function getCountryBySlug(slug: string) {
  const rows = await db
    .select()
    .from(countries)
    .where(eq(countries.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProgramBySlug(slug: string) {
  const rows = await db
    .select()
    .from(programs)
    .where(eq(programs.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getNewsBySlug(slug: string) {
  const rows = await db
    .select()
    .from(news)
    .where(eq(news.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}
