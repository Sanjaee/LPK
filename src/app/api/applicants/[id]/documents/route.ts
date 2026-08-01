import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { applicants, applicantDocuments, type ApplicantDocument } from "@/db/schema";
import { auth } from "@/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  const { id } = await params;

  const applicant = await db
    .select()
    .from(applicants)
    .where(eq(applicants.id, id))
    .then((res) => res[0]);

  if (!applicant) {
    return NextResponse.json({ error: "Pendaftar tidak ditemukan" }, { status: 404 });
  }

  if (applicant.userId !== session.user.id) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: "Tipe dokumen diperlukan" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung (PDF/JPEG/PNG)" }, { status: 400 });
    }

    // For MVP, store as data URL. In production, use S3/object storage.
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = `data:${file.type};base64,${buffer.toString("base64")}`;

    const doc = await db
      .insert(applicantDocuments)
      .values({
        applicantId: id,
        type: type as ApplicantDocument["type"],
        fileUrl,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
      })
      .returning();

    return NextResponse.json(doc[0], { status: 201 });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah dokumen" }, { status: 500 });
  }
}
