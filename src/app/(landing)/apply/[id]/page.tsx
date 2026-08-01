import { notFound } from "next/navigation";
import { db } from "@/db";
import { applicants, applicationStatusHistory, applicantDocuments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { DocumentUploadForm } from "@/components/applicants/document-upload-form";
import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";

export const metadata = {
  title: "Detail Pendaftaran",
  description: "Lihat detail dan status pendaftaran Anda",
};

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const applicant = await db
    .select()
    .from(applicants)
    .where(eq(applicants.id, id))
    .then((res) => res[0]);

  if (!applicant || applicant.userId !== session.user.id) {
    notFound();
  }

  const history = await db
    .select()
    .from(applicationStatusHistory)
    .where(eq(applicationStatusHistory.applicantId, id))
    .orderBy(applicationStatusHistory.createdAt);

  const documents = await db
    .select()
    .from(applicantDocuments)
    .where(eq(applicantDocuments.applicantId, id));

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

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{applicant.fullName}</h1>
          <div className="flex items-center gap-4">
            <Badge className={statusColors[applicant.status] || "bg-gray-100"}>
              {applicant.status.replace(/_/g, " ")}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Didaftarkan: {applicant.submittedAt?.toLocaleDateString("id-ID")}
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Data Pribadi</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{applicant.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telepon</p>
              <p className="text-sm">{applicant.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tanggal Lahir</p>
              <p className="text-sm">{applicant.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Jenis Kelamin</p>
              <p className="text-sm capitalize">{applicant.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Alamat</p>
              <p className="text-sm">
                {applicant.address}, {applicant.subDistrict}, {applicant.district}, {applicant.city},{" "}
                {applicant.province} {applicant.postalCode}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Education & Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Pendidikan & Pengalaman</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sekolah</p>
              <p className="text-sm">{applicant.school}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Jurusan</p>
              <p className="text-sm">{applicant.major}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tahun Lulus</p>
              <p className="text-sm">{applicant.gradYear}</p>
            </div>
            {applicant.workCompany && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Perusahaan</p>
                  <p className="text-sm">{applicant.workCompany}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Posisi</p>
                  <p className="text-sm">{applicant.workPosition}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Dokumen</CardTitle>
            <CardDescription>Unggah dokumen persyaratan Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.length > 0 && (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">{doc.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">{doc.originalName}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {["submitted", "document_review"].includes(applicant.status) && (
              <div className="border-t pt-4">
                <DocumentUploadForm applicantId={applicant.id} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Status</CardTitle>
            <CardDescription>Perubahan status pendaftaran Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    {index < history.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">
                      {item.fromStatus ? `${item.fromStatus} → ` : ""}
                      {item.toStatus}
                    </p>
                    {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.createdAt?.toLocaleDateString("id-ID", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
