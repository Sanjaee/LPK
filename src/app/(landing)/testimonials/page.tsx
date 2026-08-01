import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { Testimonials as TestimonialsSection } from "@/components/landing/testimonials";
import { auth } from "@/auth";
import { getLandingData } from "@/lib/services/landing";

export const metadata = {
  title: "Testimoni",
  description: "Testimoni nyata dari para alumni yang berhasil bekerja di luar negeri.",
};

export default async function TestimonialsPage() {
  const session = await auth();
  const data = await getLandingData();

  return (
    <>
      <Header isLoggedIn={!!session?.user} />
      <main className="flex-1">
        <Section>
          <SectionHeader
            title="Testimoni Alumni"
            description="Cerita nyata para alumni yang kini sukses di mancanegara."
          />
          <Container>
            <TestimonialsSection testimonials={data.testimonials} />
          </Container>
        </Section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
