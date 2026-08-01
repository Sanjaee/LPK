import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const APPLICANT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Dikirim",
  document_review: "Review Dokumen",
  interview: "Wawancara",
  medical_check: "Cek Medis",
  training: "Pelatihan",
  visa_process: "Proses Visa",
  departure: "Keberangkatan",
  overseas: "Bekerja di Luar Negeri",
  completed: "Selesai",
  rejected: "Ditolak",
};

const STATUS_VARIANTS: Record<string, "default" | "outline" | "secondary" | "destructive"> = {
  draft: "secondary",
  submitted: "outline",
  document_review: "outline",
  interview: "outline",
  medical_check: "outline",
  training: "default",
  visa_process: "default",
  departure: "default",
  overseas: "default",
  completed: "default",
  rejected: "destructive",
};

const STATUS_DOT: Record<string, string> = {
  draft: "bg-muted-foreground/50",
  submitted: "bg-blue-500",
  document_review: "bg-amber-500",
  interview: "bg-violet-500",
  medical_check: "bg-cyan-500",
  training: "bg-indigo-500",
  visa_process: "bg-pink-500",
  departure: "bg-orange-500",
  overseas: "bg-emerald-500",
  completed: "bg-emerald-600",
  rejected: "bg-destructive",
};

export function ApplicantStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] ?? "outline"} className="gap-1.5">
      <span
        className={cn(
          "size-1.5 rounded-full",
          STATUS_DOT[status] ?? "bg-muted-foreground"
        )}
      />
      {APPLICANT_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
