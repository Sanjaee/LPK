"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validations";
import { toast } from "sonner";

type Values = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: Values) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal mendaftar");

      toast.success("Registrasi berhasil", {
        description: "Akun Anda sudah siap. Silakan masuk.",
      });
      router.push("/login");
    } catch (err) {
      toast.error("Registrasi gagal", {
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
            Daftar Akun Baru
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Buat akun untuk mulai mengikuti program kerja luar negeri.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Nama Lengkap *</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Nama lengkap"
                  required
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                <FieldError errors={errors.name ? [errors.name] : []} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Email *</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  required
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                <FieldError errors={errors.email ? [errors.email] : []} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>No. Telepon</FieldLabel>
              <FieldContent>
                <Input type="tel" placeholder="+62 8..." {...register("phone")} />
                <FieldError errors={errors.phone ? [errors.phone] : []} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Password *</FieldLabel>
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

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
