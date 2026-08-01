import Image from "next/image";
import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { auth } from "@/auth";
import { getLandingData } from "@/lib/services/landing";
import { IMAGES } from "@/lib/images";

export const metadata = {
  title: "Galeri",
  description: "Galeri foto dan video kegiatan LPK Bina Karya Nusantara.",
};

export default async function GalleryPage() {
  const session = await auth();
  const data = await getLandingData();
  const galleries = data.galleries;
  const items = galleries.length
    ? galleries.map((g) => ({ src: g.image, caption: g.caption ?? null }))
    : IMAGES.gallery.map((src) => ({ src, caption: null }));

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1">
        <Section>
          <SectionHeader title="Galeri" description="Dokumentasi kegiatan kami." />
          <Container>
            <div className="columns-1 gap-4 sm:columns-2 sm:gap-6 md:columns-3 md:gap-6 lg:columns-4 lg:gap-8">
              {items.map((item, i) => (
                <div
                  key={item.src ?? i}
                  className="mb-4 inline-block w-full break-inside-avoid"
                >
                  {item.src && (
                    <Image
                      src={item.src}
                      alt={item.caption ?? "Galeri LPK"}
                      width={400}
                      height={300}
                      className="rounded-lg object-cover"
                      unoptimized
                    />
                  )}
                  {item.caption && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.caption}
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

