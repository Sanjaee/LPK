"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { Skeleton } from "@/components/ui/skeleton";

interface ApplicantRow {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  submittedAt: Date | null;
}

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

export default function ApplicantsAdminPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["applicants", "admin"],
    queryFn: async () => {
      const res = await fetch("/api/applicants");
      if (!res.ok) throw new Error("Gagal memuat pendaftar");
      return res.json();
    },
  });

  const rows = (data?.data ?? []) as ApplicantRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Pendaftar</h1>
        <p className="text-muted-foreground">Review dan kelola pendaftar pekerja migran</p>
      </div>

      {isError && <p className="text-sm text-destructive">Gagal memuat pendaftar</p>}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pendaftar</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{rows.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {rows.filter((a) => a.status === "submitted").length}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sedang Diproses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-indigo-600">
                {
                  rows.filter((a) =>
                    ["document_review", "interview", "medical_check", "training", "visa_process", "departure"].includes(a.status)
                  ).length
                }
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {rows.filter((a) => a.status === "rejected").length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pendaftar</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={rows} searchable={false} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
