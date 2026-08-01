import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createHash, randomUUID } from "node:crypto";

import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  const existing = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!existing.length) {
    return NextResponse.json({ message: "Jika email terdaftar, kami mengirim tautan reset." });
  }

  const token = createHash("sha256")
    .update(randomUUID() + email + Date.now())
    .digest("hex");

  await db.insert(passwordResetTokens).values({
    userId: existing[0].id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  // STUB: replace with email provider (Resend/Nodemailer)
  console.log(`[reset] Reset link for ${email}: ${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/reset-password?token=${token}`);

  return NextResponse.json({
    message: "Jika email terdaftar, kami mengirim tautan reset.",
  });
}

