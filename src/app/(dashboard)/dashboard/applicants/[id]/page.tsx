import { notFound } from "next/navigation";
import { db } from "@/db";
import { applicants, applicationStatusHistory, applicantDocuments, programs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/rbac";
import { StatusUpdateForm } from "@/components/applicants/status-update-form";

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

function getAllowedTransitions(status: string): string[] {
  return VALID_TRANSITIONS[status] ?? [];
}

export const metadata = {
  title: "Review Pendaftar",
  description: "Review detail pendaftar",
};

export default async function AdminApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("super_admin", "admin", "staff");

  const { id } = await params;

  const applicant = await db
    .select()
    .from(applicants)
    .where(eq(applicants.id, id))
    .then((res) => res[0]);

  if (!applicant) {
    notFound();
  }

  const program = applicant.programId
    ? await db
        .select()
        .from(programs)
        .where(eq(programs.id, applicant.programId))
        .then((res) => res[0])
    : undefined;

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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{applicant.fullName}</h1>
        <div className="flex items-center gap-4">
          <Badge className={statusColors[applicant.status] || "bg-gray-100"}>
            {applicant.status.replace(/_/g, " ")}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Program: {program?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Didaftarkan: {applicant.submittedAt?.toLocaleDateString("id-ID")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                <p className="text-sm font-medium text-muted-foreground">Status Pernikahan</p>
                <p className="text-sm capitalize">{applicant.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Golongan Darah</p>
                <p className="text-sm">{applicant.bloodType}</p>
              </div>
              <div className="col-span-2">
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
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tahun Pengalaman</p>
                    <p className="text-sm">{applicant.workYears}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          {documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dokumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium capitalize">{doc.type}</p>
                        <p className="text-xs text-muted-foreground">{doc.originalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : ""}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                      {index < history.length - 1 && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
                    </div>
                    <div className="pb-2 flex-1">
                      <p className="text-xs font-medium">
                        {item.fromStatus ? `${item.fromStatus} → ` : ""}
                        {item.toStatus}
                      </p>
                      {item.note && <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.createdAt?.toLocaleDateString("id-ID", {
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

          {/* Actions */}
          {!["completed", "rejected"].includes(applicant.status) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusUpdateForm
                  applicantId={applicant.id}
                  currentStatus={applicant.status}
                  allowedTransitions={getAllowedTransitions(applicant.status)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
