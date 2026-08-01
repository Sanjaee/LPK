import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { applicants, applicationStatusHistory } from "@/db/schema";
import { requireRole } from "@/lib/rbac";

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["submitted"],
  submitted: ["document_review", "rejected"],
  document_review: ["interview", "rejected"],
  interview: ["medical_check", "rejected"],
  medical_check: ["training", "rejected"],
  training: ["visa_process", "rejected"],
  visa_process: ["departure", "rejected"],
  departure: ["overseas"],
  overseas: ["completed"],
  completed: [],
  rejected: [],
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireRole("super_admin", "admin", "staff");
  const { id } = await params;

  const body = await request.json();
  const nextStatus = body.status as string | undefined;
  const note = (body.note as string | undefined) ?? null;

  if (!nextStatus) {
    return NextResponse.json({ error: "Status diperlukan" }, { status: 400 });
  }

  const applicant = await db
    .select()
    .from(applicants)
    .where(eq(applicants.id, id))
    .then((res) => res[0]);

  if (!applicant) {
    return NextResponse.json({ error: "Pendaftar tidak ditemukan" }, { status: 404 });
  }

  const allowed = VALID_TRANSITIONS[applicant.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    return NextResponse.json(
      { error: `Transisi tidak valid: ${applicant.status} → ${nextStatus}` },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(applicants)
    .set({ status: nextStatus as typeof applicant.status, updatedAt: new Date() })
    .where(eq(applicants.id, id))
    .returning();

  await db.insert(applicationStatusHistory).values({
    applicantId: id,
    fromStatus: applicant.status,
    toStatus: nextStatus as typeof applicant.status,
    note,
    changedBy: user.id,
  });

  return NextResponse.json(updated);
}
