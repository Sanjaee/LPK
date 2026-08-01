"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { applicantFormSchema, applicantStep1Schema, applicantStep2Schema, applicantStep3Schema, type ApplicantFormInput } from "@/lib/validations";

interface ApplicantFormProps {
  programs: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function ApplicantMultiStepForm({ programs, onSuccess }: ApplicantFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStepSchema = () => {
    switch (step) {
      case 1:
        return applicantStep1Schema;
      case 2:
        return applicantStep2Schema;
      case 3:
        return applicantStep3Schema;
      default:
        return applicantFormSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ApplicantFormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(getStepSchema()) as any,
    mode: "onChange",
  });

  const programId = watch("programId");

  const onSubmit = async (data: ApplicantFormInput) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

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
        description: "Silakan cek email untuk verifikasi.",
      });
      onSuccess?.();
    } catch (err) {
      toast.error("Gagal mendaftarkan", {
        description: (err as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <Input placeholder="Masukkan nama lengkap" {...register("fullName")} />
                  <FieldError errors={errors.fullName ? [errors.fullName] : []} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Email *</FieldLabel>
                <FieldContent>
                  <Input type="email" placeholder="email@example.com" {...register("email")} />
                  <FieldError errors={errors.email ? [errors.email] : []} />
                </FieldContent>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Telepon *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="08xxxxxxxxxx" {...register("phone")} />
                    <FieldError errors={errors.phone ? [errors.phone] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>WhatsApp</FieldLabel>
                  <FieldContent>
                    <Input placeholder="08xxxxxxxxxx" {...register("whatsapp")} />
                    <FieldError errors={errors.whatsapp ? [errors.whatsapp] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    <Input placeholder="Kota/Kabupaten" {...register("placeOfBirth")} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Jenis Kelamin *</FieldLabel>
                  <FieldContent>
                    <Select defaultValue="" onValueChange={(val) => setValue("gender", val as ApplicantFormInput["gender"])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
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
                    <Select defaultValue="" onValueChange={(val) => setValue("maritalStatus", val as ApplicantFormInput["maritalStatus"])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
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

              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Tinggi (cm)</FieldLabel>
                  <FieldContent>
                    <Input type="number" placeholder="170" {...register("heightCm", { valueAsNumber: true })} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Berat (kg)</FieldLabel>
                  <FieldContent>
                    <Input type="number" placeholder="70" {...register("weightKg", { valueAsNumber: true })} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Golongan Darah</FieldLabel>
                  <FieldContent>
                    <Select defaultValue="" onValueChange={(val) => setValue("bloodType", val ?? "")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih" />
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
                <FieldLabel>Program *</FieldLabel>
                <FieldContent>
                  <Select value={programId || ""} onValueChange={(val) => setValue("programId", val ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program" />
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
                <FieldLabel>Sekolah/Universitas *</FieldLabel>
                <FieldContent>
                  <Input placeholder="Nama institusi pendidikan" {...register("school")} />
                  <FieldError errors={errors.school ? [errors.school] : []} />
                </FieldContent>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Jurusan/Bidang *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Contoh: Teknik Mesin" {...register("major")} />
                    <FieldError errors={errors.major ? [errors.major] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Tahun Lulus *</FieldLabel>
                  <FieldContent>
                    <Input type="number" placeholder={new Date().getFullYear().toString()} {...register("gradYear", { valueAsNumber: true })} />
                    <FieldError errors={errors.gradYear ? [errors.gradYear] : []} />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>Pengalaman Kerja (Perusahaan)</FieldLabel>
                <FieldContent>
                  <Input placeholder="Nama perusahaan" {...register("workCompany")} />
                </FieldContent>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Posisi Kerja</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Contoh: Manager" {...register("workPosition")} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Tahun Pengalaman</FieldLabel>
                  <FieldContent>
                    <Input type="number" placeholder="0" {...register("workYears", { valueAsNumber: true })} />
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>Keterampilan (pisahkan dengan koma)</FieldLabel>
                <FieldContent>
                  <Textarea placeholder="Contoh: Mesin, Las, Electrical" {...register("skills")} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Bahasa (pisahkan dengan koma)</FieldLabel>
                <FieldContent>
                  <Textarea placeholder="Contoh: Inggris, Mandarin" {...register("languages")} />
                </FieldContent>
              </Field>
            </div>
          )}

          {/* Step 3: Address & Documents */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Alamat & Kontak Darurat</h3>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Provinsi *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Jawa Barat" {...register("province")} />
                    <FieldError errors={errors.province ? [errors.province] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Kota/Kabupaten *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Bandung" {...register("city")} />
                    <FieldError errors={errors.city ? [errors.city] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Kecamatan *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Bandung Wetan" {...register("district")} />
                    <FieldError errors={errors.district ? [errors.district] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Kelurahan *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Bandung Wetan" {...register("subDistrict")} />
                    <FieldError errors={errors.subDistrict ? [errors.subDistrict] : []} />
                  </FieldContent>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Kode Pos *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="40123" {...register("postalCode")} />
                    <FieldError errors={errors.postalCode ? [errors.postalCode] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>NIK</FieldLabel>
                  <FieldContent>
                    <Input placeholder="1234567890123456" {...register("nik")} />
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

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Nama Kontak Darurat *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Nama keluarga" {...register("emergencyName")} />
                    <FieldError errors={errors.emergencyName ? [errors.emergencyName] : []} />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Telepon Darurat *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="08xxxxxxxxxx" {...register("emergencyPhone")} />
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

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : step === 3 ? (
                "Kirim Pendaftaran"
              ) : (
                <>
                  Selanjutnya
                  <ChevronRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
