"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field";

const FIELD_GROUPS: {
  title: string;
  description: string;
  fields: { key: string; label: string; type?: "textarea" }[];
}[] = [
  {
    title: "Informasi Dasar",
    description: "Nama dan deskripsi LPK",
    fields: [
      { key: "site.name", label: "Nama LPK" },
      { key: "site.description", label: "Deskripsi", type: "textarea" },
    ],
  },
  {
    title: "Kontak",
    description: "Informasi kontak yang ditampilkan publik",
    fields: [
      { key: "site.phone", label: "Telepon" },
      { key: "site.email", label: "Email" },
      { key: "site.whatsapp", label: "Nomor WhatsApp" },
      { key: "site.address", label: "Alamat", type: "textarea" },
    ],
  },
  {
    title: "Media Sosial",
    description: "Link media sosial",
    fields: [
      { key: "site.social.instagram", label: "Instagram" },
      { key: "site.social.facebook", label: "Facebook" },
      { key: "site.social.youtube", label: "YouTube" },
      { key: "site.tiktok", label: "TikTok" },
    ],
  },
];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Gagal memuat pengaturan");
      return res.json();
    },
  });

  const serverFlat: Record<string, string> = {};
  if (data?.data) {
    for (const [k, v] of Object.entries(data.data as Record<string, unknown>)) {
      serverFlat[k] = typeof v === "string" ? v : JSON.stringify(v);
    }
  }

  const valueFor = (key: string) => draft[key] ?? serverFlat[key] ?? "";
  const setValueFor = (key: string, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...serverFlat, ...draft };
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal menyimpan");
    },
    onSuccess: () => {
      toast.success("Pengaturan disimpan");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola pengaturan situs</p>
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat...</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        {FIELD_GROUPS.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle>{group.title}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.fields.map((field) => (
                <Field key={field.key}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <FieldContent>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={valueFor(field.key)}
                        onChange={(e) => setValueFor(field.key, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input
                        value={valueFor(field.key)}
                        onChange={(e) => setValueFor(field.key, e.target.value)}
                      />
                    )}
                  </FieldContent>
                </Field>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <Save className="size-4 mr-2" />
          )}
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}
