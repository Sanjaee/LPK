"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQueryClient, useQueries } from "@tanstack/react-query";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "password"
  | "date"
  | "textarea"
  | "select"
  | "switch"
  | "hidden";

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  optionsUrl?: string;
  required?: boolean;
  className?: string;
}

function dateInputValue(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v.slice(0, 10);
  if (v instanceof Date) {
    const d = new Date(v.getTime() - v.getTimezoneOffset() * 60000);
    return d.toISOString().slice(0, 10);
  }
  return "";
}

export interface ResourceFormDialogProps {
  resource: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  schema: ZodTypeAny;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record?: Record<string, any> | null;
  title?: string;
}

export function ResourceFormDialog({
  resource,
  open,
  onOpenChange,
  fields,
  schema,
  record,
  title: titleProp,
}: ResourceFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!record && !!record.id;
  const title = titleProp ?? (isEdit ? `Edit ${resource}` : `Tambah ${resource}`);

  const optionsUrls = [...new Set(fields.filter((f) => f.optionsUrl).map((f) => f.optionsUrl!))];
  const optionQueries = useQueries({
    queries: optionsUrls.map((url) => ({
      queryKey: ["options", url],
      queryFn: async () => {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal memuat opsi");
        return res.json();
      },
      staleTime: 5 * 60_000,
    })),
  });
  const optionsByUrl: Record<string, { value: string; label: string }[]> = {};
  optionsUrls.forEach((url, i) => {
    optionsByUrl[url] = optionQueries[i].data?.data ?? [];
  });

  const defaultValues = fields.reduce((acc, f) => {
    acc[f.name] = f.type === "switch" ? (record?.[f.name] ?? true) : (record?.[f.name] ?? "");
    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  const watchValues = watch();

  useEffect(() => {
    if (open && record) {
      reset({ ...defaultValues });
    }
  }, [open, record, reset, defaultValues]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: Record<string, any>) => {
    try {
      const url = isEdit ? `/api/${resource}/${record!.id}` : `/api/${resource}`;
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan");
      queryClient.invalidateQueries({ queryKey: [resource, "list"] });
      toast.success("Berhasil disimpan");
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {fields.map((f) => (
            <Field key={f.name} className={f.className}>
              <FieldLabel>{f.label}{f.required && " *"}</FieldLabel>
              <FieldContent>
                {f.type === "textarea" ? (
                  <Textarea
                    placeholder={f.placeholder}
                    {...register(f.name)}
                    aria-invalid={errors[f.name] ? "true" : "false"}
                  />
                ) : f.type === "select" ? (
                  <Select
                    value={watchValues[f.name]?.toString() ?? ""}
                    onValueChange={(val) => setValue(f.name, val || undefined)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={f.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options ?? optionsByUrl[f.optionsUrl ?? ""] ?? []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : f.type === "date" ? (
                  <Input
                    type="date"
                    value={dateInputValue(watchValues[f.name])}
                    onChange={(e) => setValue(f.name, e.target.value)}
                  />
                ) : f.type === "switch" ? (
                  <Switch
                    checked={!!watchValues[f.name]}
                    onCheckedChange={(v) => setValue(f.name, v)}
                  />
                ) : f.type === "hidden" ? (
                  <Input type="hidden" {...register(f.name)} />
                ) : (
                  <Input
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    {...register(f.name)}
                    aria-invalid={errors[f.name] ? "true" : "false"}
                  />
                )}
                <FieldError
                  errors={errors[f.name] ? [{ message: String(errors[f.name]?.message) }] : []}
                />
              </FieldContent>
            </Field>
          ))}
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
