import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { auth } from "@/auth";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: `Tentang ${siteConfig.name}`,
  description: siteConfig.description,
};

const values = [
  "Legalitas resmi dan proses melalui regulasi pemerintah",
  "Bimbingan ahli dari awal hingga penempatan",
  "Akomodasi dan asuransi lengkap di luar negeri",
  "Pendampingan pasca keberangkatan",
  "Transparansi biaya dan dokumen",
];

export default async function AboutPage() {
  const session = await auth();

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1">
        <Section className="pt-8">
          <Container>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {siteConfig.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              {siteConfig.description}
            </p>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold">
                  Nilai kami
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {values.map((v) => (
                    <li key={v} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 text-primary" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-base">
                    Kontak kami
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{siteConfig.address}</p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {siteConfig.email}
                  </p>
                  <p>
                    <span className="font-medium">Telepon:</span>{" "}
                    {siteConfig.phone}
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

