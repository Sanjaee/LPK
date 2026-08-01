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
import { useQueryClient } from "@tanstack/react-query";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "password"
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
  required?: boolean;
  className?: string;
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

  const defaultValues = fields.reduce((acc, f) => {
    acc[f.name] = record?.[f.name] ?? "";
    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any>);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
  });

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
                    value={record?.[f.name]?.toString() ?? undefined}
                    onValueChange={(val) => setValue(f.name, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={f.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
