import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";
import { getLandingData } from "@/lib/services/landing";
import { formatIDR } from "@/lib/format";

export const metadata = {
  title: "Program",
  description: "Daftar semua program kerja luar negeri kami.",
};

export default async function ProgramListPage() {
  const session = await auth();
  const data = await getLandingData();

  return (
    <>
      <Header isLoggedIn={!!session?.user} />
      <main className="flex-1">
        <Section>
          <SectionHeader
            title="Semua Program"
            description="Temukan program kerja luar negeri yang sesuai dengan minat dan kualifikasi Anda."
          />
          <Container>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.programs.map((p) => (
                <Card key={p.id} className="flex flex-col group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-heading text-lg">
                        {p.name}
                      </CardTitle>
                      {p.isFeatured && <Badge>Utama</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {p.description ?? "Program kerja luar negeri terbaik."}
                    </p>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-2">
                    {p.salaryRange && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Gaji:</span>{" "}
                        <span className="font-medium">{p.salaryRange}</span>
                      </p>
                    )}
                    {p.estimatedCost && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Biaya:</span>{" "}
                        <span className="font-medium">
                          {formatIDR(p.estimatedCost)}
                        </span>
                      </p>
                    )}
                    {p.trainingDuration && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Durasi:</span>{" "}
                        <span className="font-medium">{p.trainingDuration}</span>
                      </p>
                    )}
                    <Link
                      href={`/programs/${p.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline"
                    >
                      Lihat detail
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
