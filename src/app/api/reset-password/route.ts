import { NextResponse } from "next/server";
import { eq, and, isNull, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/db";
import { users, passwordResetTokens } from "@/db/schema";

const schema = z.object({
  token: z.string().min(1, "Token tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const record = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, parsed.data.token),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record.length) {
    return NextResponse.json(
      { error: "Token tidak valid atau sudah kadaluarsa" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, record[0].userId));

  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.id, record[0].id));

  return NextResponse.json({ message: "Password berhasil diperbarui." });
}

