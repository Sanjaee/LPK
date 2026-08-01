import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { FAQ } from "@/components/landing/faq";
import { auth } from "@/auth";
import { getLandingData } from "@/lib/services/landing";

export const metadata = {
  title: "FAQ",
  description: "Pertanyaan yang sering ditanyakan seputar program LPK kami.",
};

export default async function FaqPage() {
  const session = await auth();
  const data = await getLandingData();

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1">
        <Section>
          <SectionHeader
            title="Pertanyaan yang Sering Ditanyakan"
            description="Temukan jawaban untuk pertanyaan umum seputang program kami."
          />
          <Container>
            <div className="mx-auto w-full max-w-3xl">
              <FAQ faqs={data.faqs} />
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

