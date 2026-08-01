import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getProgramBySlug, getLandingData } from "@/lib/services/landing";
import { formatIDR } from "@/lib/format";
import { IMAGES } from "@/lib/images";
import { db } from "@/db";
import { jobCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamicParams = false;

export async function generateStaticParams() {
  const data = await getLandingData();
  return data.programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};
  return {
    title: `${program.name} - Program Kerja Luar Negeri`,
    description: program.description ?? program.name,
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const program = await getProgramBySlug(slug);

  if (!program) {
    return (
      <>
        <Header isLoggedIn={!!session?.user} user={session?.user} />
        <Section>
          <SectionHeader title="Program tidak ditemukan" />
        </Section>
        <Footer />
        <WhatsAppFloatButton />
      </>
    );
  }

  const category = program.categoryId
    ? await db
        .select({ name: jobCategories.name })
        .from(jobCategories)
        .where(eq(jobCategories.id, program.categoryId))
        .then((r) => r[0])
    : undefined;

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1">
        <Section>
          <Container>
            <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Beranda</Link>
              <ArrowRight className="size-3" />
              <Link href="/programs" className="hover:text-foreground">Program</Link>
              <ArrowRight className="size-3" />
              <span className="text-foreground">{program.name}</span>
            </div>
          </Container>

          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  {program.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {program.isFeatured && <Badge>Program Utama</Badge>}
                  {category && <Badge variant="outline">{category.name}</Badge>}
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {program.description ??
                    "Ikuti program kerja luar negeri kami yang profesional."}
                </p>

                <div className="space-y-3 pt-2">
                  {program.salaryRange && (
                    <p>
                      <span className="font-medium">Rentong gaji:</span>{" "}
                      {program.salaryRange}
                    </p>
                  )}
                  {program.workingHours && (
                    <p>
                      <span className="font-medium">Jam kerja:</span>{" "}
                      {program.workingHours}
                    </p>
                  )}
                  {program.trainingDuration && (
                    <p>
                      <span className="font-medium">Durasi pelatihan:</span>{" "}
                      {program.trainingDuration}
                    </p>
                  )}
                  {program.estimatedCost && (
                    <p>
                      <span className="font-medium">Biaya program:</span>{" "}
                      {formatIDR(program.estimatedCost)}
                    </p>
                  )}
                  {program.visaInfo && (
                    <p>
                      <span className="font-medium">Info visa:</span>{" "}
                      {program.visaInfo}
                    </p>
                  )}
                </div>

                {program.requirements?.length ? (
                  <div>
                    <p className="font-medium mb-2">Persyaratan:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {program.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <Button size="lg" render={<Link href="/contact" />}>
                  Daftar Sekarang
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border">
                <Image
                  src={program.image || IMAGES.programDefault}
                  alt={program.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
