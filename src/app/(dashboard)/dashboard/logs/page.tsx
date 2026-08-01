"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ActivityLog {
  id: string;
  actorId: string | null;
  action: string;
  module: string;
  entityId: string | null;
  meta: unknown;
  ip: string | null;
  createdAt: Date;
}

const MODULES = [
  "user", "role", "country", "program", "company", "applicant",
  "news", "banner", "gallery", "testimonial", "faq", "settings",
];

export default function LogsPage() {
  const [module, setModule] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["logs", module],
    queryFn: async () => {
      const url = module ? `/api/logs?search=${module}` : "/api/logs";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal memuat log");
      return res.json();
    },
  });

  const rows = (data?.data ?? []) as ActivityLog[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Log Aktivitas</h1>
          <p className="text-muted-foreground">Riwayat aktivitas sistem</p>
        </div>
        <Select value={module} onValueChange={(val) => setModule(val ?? "")}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Semua modul" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua modul</SelectItem>
            {MODULES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError && <p className="text-sm text-destructive">Gagal memuat log</p>}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Riwayat</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {!isLoading && rows.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Tidak ada log.
            </p>
          )}

          <div className="space-y-2">
            {rows.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <Activity className="size-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {log.module}
                    </Badge>
                    <span className="text-sm font-medium">{log.action}</span>
                  </div>
                  {log.entityId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {log.entityId}
                    </p>
                  )}
                  {Boolean(log.meta) && (
                    <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap max-h-24 overflow-auto">
                      {typeof log.meta === "string" ? log.meta : JSON.stringify(log.meta, null, 2)}
                    </pre>
                  )}                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(log.createdAt).toLocaleString("id-ID", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
