import { NextResponse } from "next/server";
import { db } from "@/db";
import { applicants, applicationStatusHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { applicantFormSchema } from "@/lib/validations";
import { validateBody } from "@/lib/api/crud";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = validateBody(applicantFormSchema, body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { programId, ...applicantData } = result.data;

    // Create applicant
    const newApplicant = await db
      .insert(applicants)
      .values({
        userId: session.user.id,
        programId,
        ...applicantData,
        status: "submitted",
        submittedAt: new Date(),
      })
      .returning();

    // Create status history
    await db.insert(applicationStatusHistory).values({
      applicantId: newApplicant[0].id,
      toStatus: "submitted",
      note: "Pendaftaran awal",
      changedBy: session.user.id,
    });

    return NextResponse.json(newApplicant[0], { status: 201 });
  } catch (error) {
    console.error("Applicant registration error:", error);
    return NextResponse.json({ error: "Gagal mendaftarkan" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  try {
    const userApplicants = await db
      .select()
      .from(applicants)
      .where(eq(applicants.userId, session.user.id));

    return NextResponse.json({ data: userApplicants });
  } catch (error) {
    console.error("Fetch applicants error:", error);
    return NextResponse.json({ error: "Gagal memuat data" }, { status: 500 });
  }
}
