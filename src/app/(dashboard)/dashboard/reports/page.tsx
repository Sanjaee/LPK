"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppDonutChart } from "@/components/dashboard/donut-chart";
import { AppSimpleBarChart } from "@/components/dashboard/bar-chart";

interface ReportData {
  total: number;
  statusCounts: Record<string, number>;
  programBreakdown: { name: string; count: number }[];
  genderCounts: Record<string, number>;
  monthly: { month: string; count: number }[];
  countries: string[];
}

const STATUS_LABELS: Record<string, string> = {
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

export default function ReportsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["reports", appliedFrom, appliedTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (appliedFrom) params.set("from", appliedFrom);
      if (appliedTo) params.set("to", appliedTo);
      const res = await fetch(`/api/reports?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat laporan");
      return res.json();
    },
  });

  const report = data as ReportData | undefined;

  const applyFilter = () => {
    setAppliedFrom(from);
    setAppliedTo(to);
    refetch();
  };

  const statusData = report
    ? Object.entries(report.statusCounts).map(([name, value]) => ({
        label: STATUS_LABELS[name] ?? name,
        value,
      }))
    : [];

  const genderData = report
    ? Object.entries(report.genderCounts).map(([name, value]) => ({
        label: name === "male" ? "Laki-laki" : name === "female" ? "Perempuan" : name,
        value,
      }))
    : [];

  const monthlyData = report
    ? report.monthly.map((m) => ({
        label: m.month,
        value: m.count,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Laporan</h1>
          <p className="text-muted-foreground">Analisis pendaftaran pekerja migran</p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Dari</p>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sampai</p>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
          </div>
          <Button onClick={applyFilter} disabled={isFetching} variant="outline">
            Terapkan
          </Button>
        </div>
      </div>

      {isError && <p className="text-sm text-destructive">Gagal memuat laporan</p>}

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      )}

      {report && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Pendaftar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{report.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Aktif Diproses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(report.statusCounts.submitted ?? 0) +
                    (report.statusCounts.document_review ?? 0) +
                    (report.statusCounts.interview ?? 0) +
                    (report.statusCounts.training ?? 0) +
                    (report.statusCounts.visa_process ?? 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Selesai</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {report.statusCounts.completed ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {report.statusCounts.rejected ?? 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pendaftaran per Bulan</CardTitle>
                <CardDescription>6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyData.length > 0 ? (
                  <AppSimpleBarChart data={monthlyData} />
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Belum ada data.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Pendaftaran</CardTitle>
                <CardDescription>Distribusi status</CardDescription>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <AppDonutChart data={statusData} />
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Belum ada data.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pendaftaran per Program</CardTitle>
                <CardDescription>Program terpopuler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.programBreakdown.length > 0 ? (
                    report.programBreakdown.map((p) => (
                      <div key={p.name} className="flex items-center justify-between">
                        <span className="text-sm">{p.name}</span>
                        <Badge variant="secondary">{p.count}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Belum ada data.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jenis Kelamin</CardTitle>
                <CardDescription>Distribusi gender</CardDescription>
              </CardHeader>
              <CardContent>
                {genderData.length > 0 ? (
                  <AppDonutChart data={genderData} />
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Belum ada data.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {report.countries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Negara Tujuan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {report.countries.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
