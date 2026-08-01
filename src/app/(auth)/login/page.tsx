"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, LogIn, Loader2 } from "lucide-react";

import { authenticate } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await authenticate(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Masuk ke Akun Anda
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Masukkan email dan password untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Email *</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  required
                  name="email"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Password *</FieldLabel>
              <FieldContent>
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                />
                <FieldError errors={error ? [{ message: error }] : []} />
              </FieldContent>
            </Field>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Masuk
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Lupa password?
            </Link>
            <p className="text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Daftar
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
