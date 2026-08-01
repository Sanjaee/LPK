"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Shield, Save } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  slug: string;
  module: string;
}

const MODULE_LABELS: Record<string, string> = {
  user: "Pengguna",
  role: "Role",
  country: "Negara",
  program: "Program",
  company: "Perusahaan",
  applicant: "Pelamar",
  news: "Berita",
  banner: "Banner",
  gallery: "Galeri",
  testimonial: "Testimonial",
  faq: "FAQ",
  dashboard: "Dashboard",
  report: "Laporan",
  settings: "Pengaturan",
};

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error("Gagal memuat role");
      return res.json();
    },
  });

  const roles = (data?.roles ?? []) as Role[];
  const permissions = (data?.permissions ?? []) as Permission[];
  const activeRole = roles.find((r) => r.id === activeRoleId) ?? null;

  // Group permissions by module
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module].push(p);
    return acc;
  }, {});

  const selectRole = (role: Role) => {
    setActiveRoleId(role.id);
    setPending(role.permissions.reduce<Record<string, boolean>>((acc, slug) => {
      acc[slug] = true;
      return acc;
    }, {}));
  };

  const togglePermission = (slug: string) => {
    setPending((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const save = async () => {
    if (!activeRole) return;
    setIsSaving(true);
    try {
      const slugs = Object.entries(pending)
        .filter(([, v]) => v)
        .map(([k]) => k);
      const res = await fetch("/api/roles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: activeRole.id, permissionSlugs: slugs }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal menyimpan");
      toast.success("Izin role diperbarui");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    } catch (err) {
      toast.error("Gagal menyimpan", { description: (err as Error).message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Gagal memuat data role</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Role & Izin</h1>
        <p className="text-muted-foreground">Kelola role dan izin akses pengguna</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Role list */}
        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => selectRole(role)}
              className={`w-full text-left rounded-lg border p-4 transition-colors ${
                activeRoleId === role.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-muted-foreground" />
                  <span className="font-medium">{role.name}</span>
                </div>
                {role.isSystem && (
                  <Badge variant="secondary" className="text-xs">
                    Sistem
                  </Badge>
                )}
              </div>
              {role.description && (
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {role.permissions.length} izin
              </p>
            </button>
          ))}
        </div>

        {/* Permission editor */}
        <div className="lg:col-span-2">
          {!activeRole ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Pilih role untuk mengelola izinnya.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{activeRole.name}</CardTitle>
                    <CardDescription>{activeRole.slug}</CardDescription>
                  </div>
                  <Button onClick={save} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="size-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="size-4 mr-2" />
                    )}
                    Simpan
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(grouped).map(([module, perms]) => (
                  <div key={module}>
                    <h3 className="text-sm font-semibold mb-2">
                      {MODULE_LABELS[module] ?? module}
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {perms.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer hover:bg-muted"
                        >
                          <Checkbox
                            checked={!!pending[p.slug]}
                            onCheckedChange={() => togglePermission(p.slug)}
                          />
                          <span className="text-sm">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
