"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z.object({
  token: z.string().min(1, "Token tidak ditemukan"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirm: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirm, {
  message: "Password tidak cocok",
  path: ["confirm"],
});

type Values = z.infer<typeof schema>;

function ResetPasswordContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { token },
  });

  const onSubmit = async (data: Values) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.token, password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal mereset");
      toast.success("Password berhasil diperbarui", {
        description: "Silakan masuk kembali.",
      });
      router.push("/login");
    } catch (err) {
      toast.error("Gagal memperbarui password", {
        description: (err as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Atur Ulang Password
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Masukkan password baru Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input type="hidden" {...register("token")} />

            <Field>
              <FieldLabel>Password Baru *</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <FieldError errors={errors.password ? [errors.password] : []} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Konfirmasi Password *</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="Ulangi password"
                  required
                  minLength={6}
                  {...register("confirm")}
                  aria-invalid={errors.confirm ? "true" : "false"}
                />
                <FieldError errors={errors.confirm ? [errors.confirm] : []} />
              </FieldContent>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Simpan Password Baru
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
