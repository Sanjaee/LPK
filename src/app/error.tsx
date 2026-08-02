"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="mx-auto max-w-md text-center">
        <p className="text-6xl font-bold text-muted-foreground">500</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold">
          Terjadi kesalahan
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Server gagal merender halaman ini. Silakan coba lagi.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted-foreground">
            Digest: {error.digest}
          </p>
        )}
        <p className="mt-4 rounded-md border bg-muted p-3 text-xs text-muted-foreground">
          Jika Anda admin: pastikan environment variable{" "}
          <code className="font-mono">DATABASE_URL</code> dan{" "}
          <code className="font-mono">AUTH_SECRET</code> sudah diatur di Vercel
          (Settings → Environment Variables), lalu Redeploy.
        </p>
        <Button className="mt-4" onClick={reset}>
          Coba lagi
        </Button>
      </div>
    </div>
  );
}
