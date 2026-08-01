"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validations";
import { toast } from "sonner";

type Values = z.infer<typeof loginSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: Values) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Gagal mengirim");
      setSent(true);
    } catch (err) {
      toast.error("Gagal mengirim", {
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
            Lupa Password?
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Masukkan email Anda, kami kirim tautan reset password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <Mail className="size-10 text-primary" />
              <p className="text-sm">
                Jika email terdaftar, tautan reset sudah dikirim.
              </p>
              <Button size="sm" render={<Link href="/login" />}>
                Kembali ke masuk
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Tautan Reset"
                )}
              </Button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Kembali ke masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
