"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldLabel,
} from "@/components/ui/field";

interface StatusUpdateFormProps {
  applicantId: string;
  currentStatus: string;
  allowedTransitions: string[];
}

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted (Menunggu Review)",
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

export function StatusUpdateForm({
  applicantId,
  currentStatus,
  allowedTransitions,
}: StatusUpdateFormProps) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!nextStatus) {
      toast.error("Pilih status tujuan");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/applicants/${applicantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, note }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal memperbarui status");
      toast.success("Status diperbarui");
      setNextStatus("");
      setNote("");
      router.refresh();
    } catch (err) {
      toast.error("Gagal memperbarui status", {
        description: (err as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel>Status Saat Ini</FieldLabel>
        <FieldContent>
          <p className="text-sm font-medium">{currentStatus.replace(/_/g, " ")}</p>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Pindah Ke</FieldLabel>
        <FieldContent>
          <Select value={nextStatus} onValueChange={(val) => setNextStatus(val ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              {allowedTransitions.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s] ?? s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Catatan (opsional)</FieldLabel>
        <FieldContent>
          <Input
            placeholder="Catatan untuk perubahan status"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </FieldContent>
      </Field>

      <Button className="w-full" onClick={onSubmit} disabled={isSubmitting || !nextStatus}>
        {isSubmitting && <Loader2 className="size-4 mr-2 animate-spin" />}
        Perbarui Status
      </Button>
    </div>
  );
}
