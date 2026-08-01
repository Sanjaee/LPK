import Image from "next/image";
import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { auth } from "@/auth";
import { getLandingData } from "@/lib/services/landing";

export const metadata = {
  title: "Galeri",
  description: "Galeri foto dan video kegiatan LPK Bina Karya Nusantara.",
};

export default async function GalleryPage() {
  const session = await auth();
  const data = await getLandingData();

  return (
    <>
      <Header isLoggedIn={!!session?.user} />
      <main className="flex-1">
        <Section>
          <SectionHeader title="Galeri" description="Dokumentasi kegiatan kami." />
          <Container>
            <div className="columns-1 gap-4 sm:columns-2 sm:gap-6 md:columns-3 md:gap-6 lg:columns-4 lg:gap-8">
              {data.galleries.map((g) => (
                <div
                  key={g.id}
                  className="mb-4 inline-block w-full break-inside-avoid"
                >
                  {g.image && (
                    <Image
                      src={g.image}
                      alt={g.caption ?? "Galeri"}
                      width={400}
                      height={300}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  )}
                  {g.caption && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {g.caption}
                    </p>
                  )}
                </div>
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
