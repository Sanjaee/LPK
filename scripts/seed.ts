import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

import { roles, permissions, rolePermissions, users } from "../src/db/schema";
import { ROLE_SLUGS, PERMISSIONS, PERMISSION_DEFS } from "../src/lib/permissions";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, { prepare: false, max: 1 });
const db = drizzle(client);

async function seed() {
  console.log("Seeding roles...");

  const roleRows = [
    {
      name: "Super Admin",
      slug: ROLE_SLUGS.superAdmin,
      description: "Akses penuh ke semua modul",
      isSystem: true,
    },
    {
      name: "Admin",
      slug: ROLE_SLUGS.admin,
      description: "Mengelola konten, program, dan pelamar",
      isSystem: true,
    },
    {
      name: "Staff",
      slug: ROLE_SLUGS.staff,
      description: "Membantu proses verifikasi dokumen dan wawancara",
      isSystem: true,
    },
    {
      name: "Instruktur",
      slug: ROLE_SLUGS.instructor,
      description: "Mengelola pelatihan dan penilaian",
      isSystem: true,
    },
    {
      name: "Siswa / Pelamar",
      slug: ROLE_SLUGS.student,
      description: "Mendaftar program dan melengkapi data",
      isSystem: true,
    },
  ];

  const insertedRoles = await db
    .insert(roles)
    .values(roleRows)
    .onConflictDoUpdate({
      target: roles.slug,
      set: { name: sql`excluded.name`, description: sql`excluded.description` },
    })
    .returning();

  const roleMap = new Map(insertedRoles.map((r) => [r.slug, r.id]));
  console.log(`Roles seeded: ${insertedRoles.length}`);

  console.log("Seeding permissions...");

  const permissionDefs = PERMISSION_DEFS.map((slug) => {
    const [module, action] = slug.split(".");
    const name = `${action.charAt(0).toUpperCase() + action.slice(1).replace("_", " ")} ${module}`;
    return { name, slug, module };
  });

  const insertedPerms = await db
    .insert(permissions)
    .values(permissionDefs)
    .onConflictDoNothing()
    .returning();

  console.log(`Permissions seeded: ${insertedPerms.length}`);

  const allPerms = insertedPerms.length
    ? insertedPerms
    : await db.select().from(permissions);

  const permBySlug = new Map(allPerms.map((p) => [p.slug, p.id]));

  const rolePermissionMap: Record<string, string[]> = {
    [ROLE_SLUGS.superAdmin]: Object.values(PERMISSIONS).map((p) => p as string),
    [ROLE_SLUGS.admin]: [
      PERMISSIONS.dashboardView,
      PERMISSIONS.countryView,
      PERMISSIONS.countryCreate,
      PERMISSIONS.countryUpdate,
      PERMISSIONS.countryDelete,
      PERMISSIONS.programView,
      PERMISSIONS.programCreate,
      PERMISSIONS.programUpdate,
      PERMISSIONS.programDelete,
      PERMISSIONS.companyView,
      PERMISSIONS.companyCreate,
      PERMISSIONS.companyUpdate,
      PERMISSIONS.companyDelete,
      PERMISSIONS.applicantView,
      PERMISSIONS.applicantUpdate,
      PERMISSIONS.applicantDocumentReview,
      PERMISSIONS.applicantStatusUpdate,
      PERMISSIONS.newsView,
      PERMISSIONS.newsCreate,
      PERMISSIONS.newsUpdate,
      PERMISSIONS.newsDelete,
      PERMISSIONS.bannerView,
      PERMISSIONS.bannerCreate,
      PERMISSIONS.bannerUpdate,
      PERMISSIONS.bannerDelete,
      PERMISSIONS.galleryView,
      PERMISSIONS.galleryCreate,
      PERMISSIONS.galleryUpdate,
      PERMISSIONS.galleryDelete,
      PERMISSIONS.testimonialView,
      PERMISSIONS.testimonialCreate,
      PERMISSIONS.testimonialUpdate,
      PERMISSIONS.testimonialDelete,
      PERMISSIONS.faqView,
      PERMISSIONS.faqCreate,
      PERMISSIONS.faqUpdate,
      PERMISSIONS.faqDelete,
      PERMISSIONS.reportView,
    ],
    [ROLE_SLUGS.staff]: [
      PERMISSIONS.dashboardView,
      PERMISSIONS.countryView,
      PERMISSIONS.programView,
      PERMISSIONS.applicantView,
      PERMISSIONS.applicantUpdate,
      PERMISSIONS.applicantDocumentReview,
      PERMISSIONS.applicantStatusUpdate,
    ],
    [ROLE_SLUGS.instructor]: [
      PERMISSIONS.dashboardView,
      PERMISSIONS.applicantView,
    ],
    [ROLE_SLUGS.student]: [
      PERMISSIONS.applicantCreate,
      PERMISSIONS.applicantUpdate,
    ],
  };

  for (const [roleSlug, permSlugs] of Object.entries(rolePermissionMap)) {
    const roleId = roleMap.get(roleSlug);
    if (!roleId) continue;

    const links = permSlugs
      .map((s) => {
        const permId = permBySlug.get(s);
        return permId ? { roleId, permissionId: permId } : null;
      })
      .filter(Boolean) as { roleId: string; permissionId: string }[];

    if (!links.length) continue;

    await db
      .insert(rolePermissions)
      .values(links)
      .onConflictDoNothing();
  }
  console.log("Role-permission links seeded");

  console.log("Seeding admin user...");

  const adminRoleId = roleMap.get(ROLE_SLUGS.superAdmin)!;
  const password = await bcrypt.hash("admin123", 10);

  await db
    .insert(users)
    .values({
      name: "Administrator",
      email: "admin@lpk.com",
      password,
      roleId: adminRoleId,
      emailVerifiedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { roleId: adminRoleId },
    });

  console.log("Admin user ready (admin@lpk.com / admin123)");
  console.log("Seed complete ✓");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
