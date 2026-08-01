import { db } from "@/db";
import { applicants, users, programs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const metadata = {
  title: "Kelola Pendaftar",
  description: "Kelola dan review pendaftar pekerja migran",
};

interface ApplicantRow {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  submittedAt: Date | null;
}

export default async function ApplicantsAdminPage() {
  const applicantsList = await db
    .select({
      id: applicants.id,
      fullName: applicants.fullName,
      email: applicants.email,
      phone: applicants.phone,
      status: applicants.status,
      submittedAt: applicants.submittedAt,
    })
    .from(applicants)
    .orderBy(applicants.submittedAt);

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

  const columns: ColumnDef<ApplicantRow>[] = [
    {
      accessorKey: "fullName",
      header: "Nama",
      cell: (info) => <span className="font-medium">{String(info.getValue())}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => String(info.getValue()),
    },
    {
      accessorKey: "phone",
      header: "Telepon",
      cell: (info) => String(info.getValue() ?? "-"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = String(info.getValue());
        return (
          <Badge className={statusColors[status] || "bg-gray-100"}>
            {status.replace(/_/g, " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "submittedAt",
      header: "Tanggal Pendaftaran",
      cell: (info) => {
        const date = info.getValue() as Date | null;
        return date
          ? new Date(date).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-";
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <Link href={`/dashboard/applicants/${row.original.id}`}>
          <Button variant="ghost" size="sm" className="text-xs">
            Lihat Detail
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Pendaftar</h1>
        <p className="text-muted-foreground">Review dan kelola pendaftar pekerja migran</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicantsList.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {applicantsList.filter((a) => a.status === "submitted").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sedang Diproses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {
                applicantsList.filter((a) =>
                  ["document_review", "interview", "medical_check", "training", "visa_process", "departure"].includes(a.status)
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {applicantsList.filter((a) => a.status === "rejected").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendaftar</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={applicantsList} searchable={false} />
        </CardContent>
      </Card>
    </div>
  );
}
