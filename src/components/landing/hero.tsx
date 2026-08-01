import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig, whatsappLink } from "@/lib/site";
import { IMAGES } from "@/lib/images";

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/5 via-background to-background" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:py-32 lg:px-8">
        <div className="space-y-8">
          <Badge variant="outline" className="text-xs">
            {siteConfig.tagline}
          </Badge>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
            <span className="block">Bina masa depan karir internasional</span>
            <span className="block text-primary">Anda dengan tenaga</span>
            <span className="block">profesional Indonesia.</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            {siteConfig.description} Dukungan lengkap mulai dari seleksi,
            pelatihan bahasa, hingga proses visa dan penempatan.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {isLoggedIn ? (
              <Button size="lg" render={<Link href="/dashboard" />}>
                <span>Buka Dashboard</span>
                <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <>
                <Button size="lg" render={<Link href="/register" />}>
                  Daftar Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/programs" />}
                >
                  Lihat Program
                </Button>
              </>
            )}
            <Button
              size="lg"
              variant="outline"
              render={
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Chat WhatsApp
            </Button>
          </div>
        </div>
        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-md">
          <div className="relative col-span-2 aspect-[3/2] w-full max-w-md overflow-hidden rounded-xl shadow-2xl ring-1 ring-foreground/10">
            <Image
              src={IMAGES.hero}
              alt="Tenaga kerja profesional Indonesia"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
