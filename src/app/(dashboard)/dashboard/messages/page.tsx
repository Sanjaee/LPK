"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["messages", "list"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Gagal memuat pesan");
      return res.json();
    },
  });

  const rows = (data?.data ?? []) as ContactMessage[];

  const toggleRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", "list"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
    },
    onSuccess: () => {
      toast.success("Pesan dihapus");
      queryClient.invalidateQueries({ queryKey: ["messages", "list"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = search
    ? rows.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pesan Kontak</h1>
        <p className="text-muted-foreground">Pesan yang dikirim melalui formulir kontak</p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Cari berdasarkan nama atau email..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Badge variant="secondary">
          {rows.filter((m) => !m.isRead).length} belum dibaca
        </Badge>
      </div>

      {isError && (
        <p className="text-sm text-destructive">Gagal memuat pesan</p>
      )}

      <div className="space-y-3">
        {isLoading && (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        )}

        {!isLoading && filtered.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Tidak ada pesan.
            </CardContent>
          </Card>
        )}

        {filtered.map((msg) => (
          <Card
            key={msg.id}
            className={msg.isRead ? "" : "border-primary/50"}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {msg.isRead ? (
                      <MailOpen className="size-4 text-muted-foreground" />
                    ) : (
                      <Mail className="size-4 text-primary" />
                    )}
                    <p className="font-medium truncate">{msg.name}</p>
                    {!msg.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        Baru
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {msg.email}
                    {msg.phone ? ` • ${msg.phone}` : ""}
                  </p>
                  {msg.subject && (
                    <p className="text-sm font-medium mt-2">{msg.subject}</p>
                  )}
                  <p className="text-sm mt-1 whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(msg.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleRead.mutate({ id: msg.id, isRead: !msg.isRead })}
                  >
                    {msg.isRead ? "Tandai belum dibaca" : "Tandai dibaca"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-destructive"
                    onClick={() => {
                      if (confirm("Hapus pesan ini?")) deleteMessage.mutate(msg.id);
                    }}
                  >
                    <Trash2 className="size-3 mr-1" />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
