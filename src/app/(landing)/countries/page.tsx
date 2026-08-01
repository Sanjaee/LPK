import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";

import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { getLandingData } from "@/lib/services/landing";
import { formatIDR } from "@/lib/format";

export const metadata = {
  title: "Negara Tujuan",
  description: "Daftar negara tujuan kerja luar negeri kami.",
};

export default async function CountryListPage() {
  const session = await auth();
  const data = await getLandingData();

  return (
    <>
      <Header isLoggedIn={!!session?.user} />
      <main className="flex-1">
        <Section>
          <SectionHeader
            title="Negara Tujuan"
            description="Rekomendasi program kerja luar negeri terbaik untuk tenaga kerja Indonesia."
          />
          <Container>
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.countries.map((c) => (
                <Link
                  key={c.id}
                  href={`/countries/${c.slug}`}
                  className="group block rounded-xl border p-0 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[3/1]">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-linear-to-br from-primary/25 via-primary/10 to-transparent" />
                    )}
                    {c.flagEmoji && (
                      <span className="absolute top-3 left-3 text-3xl">{c.flagEmoji}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg group-hover:text-primary">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {c.description ?? `Peluang kerja di ${c.name}.`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Section className="bg-muted/40">
        <SectionHeader
          title="Program Unggulan"
          description="Program kerja terbaik kami di berbagai negara."
        />
        <Container>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.programs.map((p) => (
              <div
                key={p.id}
                className="flex flex-col rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-lg">{p.name}</h3>
                  {p.isFeatured && <Badge>Featured</Badge>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                  {p.description ?? "Program kerja luar negeri terbaik."}
                </p>
                {p.salaryRange && (
                  <p className="mt-3 text-sm">
                    Gaji:{" "}
                    <span className="font-medium">{p.salaryRange}</span>
                  </p>
                )}
                {p.estimatedCost && (
                  <p className="text-sm">
                    Biaya:{" "}
                    <span className="font-medium">{formatIDR(p.estimatedCost)}</span>
                  </p>
                )}
                <Link
                  href={`/programs/${p.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Detail program
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
