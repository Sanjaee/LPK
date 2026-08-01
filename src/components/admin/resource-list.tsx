"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceFormDialog, type FieldConfig } from "@/components/admin/resource-form-dialog";
import { type ZodTypeAny } from "zod";

interface ResourceListProps<TData extends { id: React.Key }> {
  resource: string;
  label: string;
  columns: ColumnDef<TData>[];
  fields: FieldConfig[];
  schema: ZodTypeAny;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Gagal memuat data" }));
    throw new Error(error);
  }
  return res.json();
};

export function ResourceList<TData extends { id: React.Key }>({
  resource,
  label,
  columns,
  fields,
  schema,
}: ResourceListProps<TData>) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TData | null>(null);

  const {
    data,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [resource, "list"],
    queryFn: () => fetcher(`/api/${resource}`),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
     mutationFn: async (id: React.Key) => {
      const res = await fetch(`/api/${resource}/${String(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Gagal menghapus" }));
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: [resource, "list"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = (data?.data ?? []) as TData[];

  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    enableHiding: false,
    header: () => "",
    cell: ({ row }) => {
      const r = row.original as TData & { id: React.Key };
      return (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-1.5 text-xs"
            onClick={() => setEditing(r)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-1.5 text-xs text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm(`Hapus ${label} ini?`)) deleteMutation.mutate(r.id);
            }}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      );
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Input
            placeholder="Cari..."
            onChange={(e) =>
              queryClient.setQueryData([resource, "search"], e.target.value)
            }
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className="size-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => { setEditing(null); setFormOpen(true); }}
          >
            <Plus className="size-4" /> Tambah
          </Button>
        </div>
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message ?? "Gagal memuat data"}
        </p>
      )}

      <DataTable
        columns={[...columns, actionColumn]}
        data={rows}
        searchable={false}
      />

      <ResourceFormDialog
        resource={resource}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) { setEditing(null); refetch(); }
        }}
        fields={fields}
        schema={schema}
        record={editing}
        title={editing ? `Edit ${label}` : `Tambah ${label}`}
      />
    </div>
  );
}
