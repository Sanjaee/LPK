import Link from "next/link";
import { Users, Globe2, Briefcase, Newspaper, Mail } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { AppSimpleBarChart } from "@/components/dashboard/bar-chart";
import { AppDonutChart, AppDonutChartSkeleton } from "@/components/dashboard/donut-chart";
import { ApplicantStatusBadge, APPLICANT_STATUS_LABELS } from "@/components/applicants/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { getDashboardStats, getDashboardRecentApplicants } from "@/lib/services/dashboard";

const STATUS_COLORS: Record<string, string> = {
  draft: "#9ca3af",
  submitted: "#60a5fa",
  document_review: "#f59e0b",
  interview: "#8b5cf6",
  medical_check: "#06b6d4",
  training: "#6366f1",
  visa_process: "#ec4899",
  departure: "#f97316",
  overseas: "#10b981",
  completed: "#16a34a",
  rejected: "#ef4444",
};

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([
    getDashboardStats(),
    getDashboardRecentApplicants(8),
  ]);

  const monthlyData = stats.monthlyApplicants.map((m) => ({
    label: m.month,
    value: Number(m.count),
  }));

  const statusData = stats.statusCounts.map((s) => ({
    label: APPLICANT_STATUS_LABELS[s.status] ?? s.status,
    value: Number(s.count),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Pelamar" value={stats.applicantCount} icon={Users} />
        <StatCard title="Pengguna" value={stats.userCount} icon={Users} />
        <StatCard title="Negara" value={stats.countryCount} icon={Globe2} />
        <StatCard title="Program" value={stats.programCount} icon={Briefcase} />
        <StatCard title="Berita" value={stats.newsCount} icon={Newspaper} />
        <StatCard title="Pesan Masuk" value={stats.messageCount} icon={Mail} />
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="font-heading text-base">
              Pendaftar 30 hari terakhir
            </CardTitle>
            <CardDescription>Perkembangan pendaftar per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <AppSimpleBarChart data={monthlyData} />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading text-base">Status Pelamar</CardTitle>
            <CardDescription>Distribusi status saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length ? (
              <AppDonutChart data={statusData} />
            ) : (
              <AppDonutChartSkeleton />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Aktivitas terkini</CardTitle>
          <CardDescription>8 pelamar yang paling baru terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tgl daftar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/applicants/${a.id}`}>{a.fullName}</Link>
                  </TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>
                    <ApplicantStatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(a.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
              {recent.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Belum ada pelamar
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
