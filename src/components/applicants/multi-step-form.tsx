"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TagInput } from "@/components/applicants/tag-input";
import { applicantFormSchema, type ApplicantFormInput } from "@/lib/validations";

interface ApplicantFormProps {
  programs: { id: string; name: string }[];
  onSuccess?: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 61 }, (_, i) => CURRENT_YEAR - i);

const GENDER_LABELS: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

const MARITAL_LABELS: Record<string, string> = {
  single: "Belum Menikah",
  married: "Menikah",
  divorced: "Cerai",
  widowed: "Duda/Janda",
};

const selectDisplay = (value: string | undefined, placeholder: string, label?: string) => (
  <span className="flex flex-1 items-center truncate text-left">
    {value ? (label ?? value) : <span className="text-muted-foreground">{placeholder}</span>}
  </span>
);

const STEP_FIELDS: Record<number, (keyof ApplicantFormInput)[]> = {
  1: ["fullName", "email", "phone", "whatsapp", "dateOfBirth", "placeOfBirth", "gender", "maritalStatus"],
  2: ["programId", "school", "major", "gradYear", "skills", "languages"],
  3: ["province", "city", "district", "subDistrict", "postalCode", "address", "emergencyName", "emergencyPhone"],
};

export function ApplicantMultiStepForm({ programs, onSuccess }: ApplicantFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ApplicantFormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(applicantFormSchema) as any,
    mode: "onTouched",
    defaultValues: {
      heightCm: undefined,
      weightKg: undefined,
      gradYear: CURRENT_YEAR,
      workYears: undefined,
      skills: [],
      languages: [],
    },
  });

  const nextStep = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep(step + 1);
  };

  const onSubmit = async (data: ApplicantFormInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal mendaftarkan");

      toast.success("Pendaftaran berhasil", {
        description: "Terima kasih, pendaftaran Anda telah kami terima.",
      });
      onSuccess?.();
      router.push("/apply/mine");
    } catch (err) {
      toast.error("Gagal mendaftarkan", {
        description: (err as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const gender = watch("gender");
  const maritalStatus = watch("maritalStatus");
  const bloodType = watch("bloodType");
  const programId = watch("programId");
  const gradYear = watch("gradYear");
  const skills = watch("skills");
  const languages = watch("languages");

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Formulir Pendaftaran Pekerja Migran</CardTitle>
        <CardDescription>Langkah {step} dari 3</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Data Pribadi</h3>

              <Field>
                <FieldLabel>Nama Lengkap *</FieldLabel>
                <FieldContent>
                  <Input placeholder="Nama lengkap sesuai KTP" {...register("fullName")} />
                  <FieldError errors={errors.fullName ? [errors.fullName] : []} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Email *</FieldLabel>
                <FieldContent>
                  <Input type="email" inputMode="email" placeholder="nama@email.com" {...register("email")} />
                  <FieldError errors={errors.email ? [errors.email] : []} />
                </FieldContent>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Telepon *</FieldLabel>
                  <FieldContent>
                    <Input type="tel" inputMode="tel" placeholder="08xxxxxxxxxx" {...register("phone")} />
                    <FieldError errors={errors.phone ? [errors.phone] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>WhatsApp</FieldLabel>
                  <FieldContent>
                    <Input type="tel" inputMode="tel" placeholder="08xxxxxxxxxx" {...register("whatsapp")} />
                    <FieldError errors={errors.whatsapp ? [errors.whatsapp] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Tanggal Lahir *</FieldLabel>
                  <FieldContent>
                    <Input type="date" {...register("dateOfBirth")} />
                    <FieldError errors={errors.dateOfBirth ? [errors.dateOfBirth] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Tempat Lahir</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Kota / Kabupaten" {...register("placeOfBirth")} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Jenis Kelamin *</FieldLabel>
                  <FieldContent>
                    <Select
                      value={gender || ""}
                      onValueChange={(val) => setValue("gender", val as ApplicantFormInput["gender"])}
                    >
                      <SelectTrigger className="w-full">
                        {selectDisplay(gender, "Pilih jenis kelamin", gender ? GENDER_LABELS[gender] : undefined)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={errors.gender ? [errors.gender] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Status Pernikahan *</FieldLabel>
                  <FieldContent>
                    <Select
                      value={maritalStatus || ""}
                      onValueChange={(val) => setValue("maritalStatus", val as ApplicantFormInput["maritalStatus"])}
                    >
                      <SelectTrigger className="w-full">
                        {selectDisplay(maritalStatus, "Pilih status", maritalStatus ? MARITAL_LABELS[maritalStatus] : undefined)}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Belum Menikah</SelectItem>
                        <SelectItem value="married">Menikah</SelectItem>
                        <SelectItem value="divorced">Cerai</SelectItem>
                        <SelectItem value="widowed">Duda/Janda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError errors={errors.maritalStatus ? [errors.maritalStatus] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel>Tinggi (cm)</FieldLabel>
                  <FieldContent>
                    <Input type="number" inputMode="numeric" min={100} max={250} placeholder="170" {...register("heightCm", { valueAsNumber: true })} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Berat (kg)</FieldLabel>
                  <FieldContent>
                    <Input type="number" inputMode="numeric" min={30} max={200} placeholder="65" {...register("weightKg", { valueAsNumber: true })} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Golongan Darah</FieldLabel>
                  <FieldContent>
                    <Select
                      value={bloodType || ""}
                      onValueChange={(val) => setValue("bloodType", val ?? "")}
                    >
                      <SelectTrigger className="w-full">
                        {selectDisplay(bloodType, "Pilih")}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="AB">AB</SelectItem>
                        <SelectItem value="O">O</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </div>
            </div>
          )}

          {/* Step 2: Education & Experience */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Pendidikan & Pengalaman</h3>

              <Field>
                <FieldLabel>Program yang Diinginkan *</FieldLabel>
                <FieldContent>
                  <Select
                    value={programId || ""}
                    onValueChange={(val) => setValue("programId", val ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      {selectDisplay(programId, "Pilih program", programs.find((p) => p.id === programId)?.name)}
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={errors.programId ? [errors.programId] : []} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Sekolah / Universitas *</FieldLabel>
                <FieldContent>
                  <Input placeholder="Nama institusi pendidikan" {...register("school")} />
                  <FieldError errors={errors.school ? [errors.school] : []} />
                </FieldContent>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Jurusan / Bidang *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Contoh: Teknik Mesin" {...register("major")} />
                    <FieldError errors={errors.major ? [errors.major] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Tahun Lulus *</FieldLabel>
                  <FieldContent>
                    <Select
                      value={String(gradYear)}
                      onValueChange={(val) => setValue("gradYear", Number(val))}
                    >
                      <SelectTrigger className="w-full">
                        {selectDisplay(String(gradYear), "Pilih tahun")}
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={errors.gradYear ? [errors.gradYear] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Pengalaman Kerja</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Nama perusahaan terakhir" {...register("workCompany")} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Posisi Terakhir</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Contoh: Operator Mesin" {...register("workPosition")} />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>Tahun Pengalaman</FieldLabel>
                <FieldContent>
                  <Input type="number" inputMode="numeric" min={0} max={50} placeholder="0" {...register("workYears", { valueAsNumber: true })} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Keterampilan</FieldLabel>
                <FieldContent>
                  <TagInput
                    value={skills ?? []}
                    onChange={(tags) => setValue("skills", tags)}
                    placeholder="Ketik keterampilan lalu tekan Enter"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contoh: Mengelas, Mengemudi, Menjahit
                  </p>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Bahasa yang Dikuasai</FieldLabel>
                <FieldContent>
                  <TagInput
                    value={languages ?? []}
                    onChange={(tags) => setValue("languages", tags)}
                    placeholder="Ketik bahasa lalu tekan Enter"
                  />
                  <p className="text-xs text-muted-foreground">
                    Contoh: Inggris, Mandarin, Arab
                  </p>
                </FieldContent>
              </Field>
            </div>
          )}

          {/* Step 3: Address & Emergency Contact */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Alamat Domisili</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Provinsi *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Contoh: Jawa Barat" {...register("province")} />
                    <FieldError errors={errors.province ? [errors.province] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Kota / Kabupaten *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Contoh: Bandung" {...register("city")} />
                    <FieldError errors={errors.city ? [errors.city] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Kecamatan *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Nama kecamatan" {...register("district")} />
                    <FieldError errors={errors.district ? [errors.district] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Kelurahan / Desa *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Nama kelurahan" {...register("subDistrict")} />
                    <FieldError errors={errors.subDistrict ? [errors.subDistrict] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Kode Pos *</FieldLabel>
                  <FieldContent>
                    <Input type="text" inputMode="numeric" maxLength={5} placeholder="40123" {...register("postalCode")} />
                    <FieldError errors={errors.postalCode ? [errors.postalCode] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>NIK</FieldLabel>
                  <FieldContent>
                    <Input type="text" inputMode="numeric" maxLength={16} placeholder="16 digit NIK" {...register("nik")} />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>Alamat Lengkap *</FieldLabel>
                <FieldContent>
                  <Textarea placeholder="Jalan, nomor rumah, RT/RW" {...register("address")} />
                  <FieldError errors={errors.address ? [errors.address] : []} />
                </FieldContent>
              </Field>

              <h3 className="text-sm font-semibold pt-4">Kontak Darurat</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Nama Kontak Darurat *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Nama keluarga / kerabat" {...register("emergencyName")} />
                    <FieldError errors={errors.emergencyName ? [errors.emergencyName] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Telepon Darurat *</FieldLabel>
                  <FieldContent>
                    <Input type="tel" inputMode="tel" placeholder="08xxxxxxxxxx" {...register("emergencyPhone")} />
                    <FieldError errors={errors.emergencyPhone ? [errors.emergencyPhone] : []} />
                  </FieldContent>
                </Field>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="size-4 mr-2" />
              Sebelumnya
            </Button>

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Selanjutnya
                <ChevronRight className="size-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Kirim Pendaftaran"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
