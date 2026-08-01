"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

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

interface DocumentUploadFormProps {
  applicantId: string;
}

const DOCUMENT_TYPES = [
  { value: "photo", label: "Foto" },
  { value: "ktp", label: "KTP" },
  { value: "kk", label: "Kartu Keluarga" },
  { value: "passport", label: "Paspor" },
  { value: "birth_certificate", label: "Akta Lahir" },
  { value: "diploma", label: "Ijazah" },
  { value: "certificate", label: "Sertifikat" },
  { value: "other", label: "Lainnya" },
];

export function DocumentUploadForm({ applicantId }: DocumentUploadFormProps) {
  const router = useRouter();
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!docType) {
      toast.error("Pilih tipe dokumen");
      return;
    }
    if (!file) {
      toast.error("Pilih file");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", docType);

      const res = await fetch(`/api/applicants/${applicantId}/documents`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal mengunggah");
      toast.success("Dokumen berhasil diunggah");
      setDocType("");
      setFile(null);
      router.refresh();
    } catch (err) {
      toast.error("Gagal mengunggah", {
        description: (err as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Tipe Dokumen</FieldLabel>
          <FieldContent>
            <Select value={docType} onValueChange={(val) => setDocType(val ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>File (PDF/JPEG/PNG, max 5MB)</FieldLabel>
          <FieldContent>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </FieldContent>
        </Field>
      </div>

      <Button onClick={onSubmit} disabled={isSubmitting || !docType || !file}>
        {isSubmitting ? (
          <Loader2 className="size-4 mr-2 animate-spin" />
        ) : (
          <Upload className="size-4 mr-2" />
        )}
        Unggah Dokumen
      </Button>
    </div>
  );
}
