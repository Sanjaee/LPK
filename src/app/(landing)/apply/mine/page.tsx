import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { applicants, programs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getRoleById } from "@/lib/rbac";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";

export const metadata = {
  title: "Pendaftaran Saya",
  description: "Lihat status pendaftaran pekerja migran Anda",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  document_review: "bg-yellow-100 text-yellow-800",
  interview: "bg-indigo-100 text-indigo-800",
  medical_check: "bg-cyan-100 text-cyan-800",
  training: "bg-teal-100 text-teal-800",
  visa_process: "bg-purple-100 text-purple-800",
  departure: "bg-orange-100 text-orange-800",
  overseas: "bg-pink-100 text-pink-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Diajukan",
  document_review: "Review Dokumen",
  interview: "Interview",
  medical_check: "Medical Check",
  training: "Pelatihan",
  visa_process: "Proses Visa",
  departure: "Keberangkatan",
  overseas: "Di Luar Negeri",
  completed: "Selesai",
  rejected: "Ditolak",
};

export default async function MyApplicationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const role = session.user.roleId ? await getRoleById(session.user.roleId) : null;
  if (role && ["super_admin", "admin", "staff", "instructor"].includes(role.slug)) {
    redirect("/dashboard/applicants");
  }

  const myApplicants = await db
    .select()
    .from(applicants)
    .where(eq(applicants.userId, session.user.id))
    .orderBy(applicants.createdAt);

  // Fetch programs for the applicant programId
  const programIds = myApplicants.map((a) => a.programId).filter(Boolean) as string[];
  const programsList = programIds.length
    ? await db.select().from(programs).where(eq(programs.id, programIds[0]))
    : [];

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pendaftaran Saya</h1>
          <p className="text-muted-foreground">Lacak status pendaftaran pekerja migran Anda</p>
        </div>

        {myApplicants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Anda belum memiliki pendaftaran.</p>
              <Link href="/apply">
                <Button>Daftar Sekarang</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myApplicants.map((a) => {
              const program = programsList.find((p) => p.id === a.programId);
              return (
                <Card key={a.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{a.fullName}</CardTitle>
                      <Badge className={statusColors[a.status] || "bg-gray-100"}>
                        {statusLabels[a.status] ?? a.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <CardDescription>
                      Program: {program?.name ?? "—"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Didaftarkan:{" "}
                        {a.submittedAt
                          ? new Date(a.submittedAt).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </p>
                      <Link href={`/apply/${a.id}`}>
                        <Button variant="outline" size="sm">
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

