import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { getCountryBySlug, getFeaturedPrograms } from "@/lib/services/landing";
import { formatIDR } from "@/lib/format";
import { countryImage } from "@/lib/images";
import { db } from "@/db";
import { programs } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) return {};
  return {
    title: `${country.name} - Program Kerja Luar Negeri`,
    description: country.description ?? `Program kerja ke ${country.name}.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const country = await getCountryBySlug(slug);

  if (!country) {
    return (
      <>
        <Header isLoggedIn={!!session?.user} user={session?.user} />
        <main className="flex-1">
          <Section>
            <SectionHeader title="Negara tidak ditemukan" />
          </Section>
        </main>
        <Footer />
        <WhatsAppFloatButton />
      </>
    );
  }

  const countryPrograms = await db
    .select()
    .from(programs)
    .where(and(eq(programs.countryId, country.id), isNull(programs.deletedAt)));

  const featured = await getFeaturedPrograms(3);

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1">
        <Section className="pt-8">
          <Container>
            <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Beranda
              </Link>
              <ArrowRight className="size-3" />
              <Link href="/countries" className="hover:text-foreground">
                Negara
              </Link>
              <ArrowRight className="size-3" />
              <span className="text-foreground">{country.name}</span>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  {country.flagEmoji && (
                    <span className="text-3xl">{country.flagEmoji}</span>
                  )}
                  <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                    {country.name}
                  </h1>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {country.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{country.code ?? "—"}</Badge>
                  <Badge variant="secondary">Visa tersedia</Badge>
                </div>
                <Button size="lg" render={<Link href={"/contact"} />}>
                  Konsultasi Gratis
                </Button>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border">
                <Image
                  src={country.image || countryImage(country.slug)}
                  alt={country.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </Section>

        {countryPrograms.length > 0 && (
          <Section className="bg-muted/40">
            <SectionHeader
              title={`Program di ${country.name}`}
              description="Program kerja yang tersedia di negara ini."
            />
            <Container>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {countryPrograms.map((p) => (
                  <Card key={p.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="font-heading text-lg">{p.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {p.salaryRange} · {p.trainingDuration}
                      </p>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      {p.estimatedCost && (
                        <p className="text-sm">
                          Biaya:{" "}
                          <span className="font-medium">
                            {formatIDR(p.estimatedCost)}
                          </span>
                        </p>
                      )}
                      <Link
                        href={`/programs/${p.slug}`}
                        className="mt-2 block text-sm font-medium text-primary"
                      >
                        Lihat detail
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </Section>
        )}

        <Section>
          <SectionHeader
            title="Program Unggulan Lainnya"
            description="Temukan peluang di negara lain yang kami tawarkan."
          />
          <Container>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <Card key={p.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">{p.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{p.salaryRange}</p>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Link
                      href={`/programs/${p.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                    >
                      Detail
                      <ArrowRight className="size-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
