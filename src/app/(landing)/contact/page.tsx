import { Contact } from "@/components/landing/contact";
import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader } from "@/components/landing/ui";
import { auth } from "@/auth";

export const metadata = {
  title: "Kontak Kami",
  description: "Hubungi LPK Bina Karya Nusantara untuk pertanyaan dan konsultasi program kerja luar negeri.",
};

export default async function ContactPage() {
  const session = await auth();
  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1 flex flex-col">
        <Section className="pt-16 md:pt-20">
          <SectionHeader
            title="Kontak Kami"
            description="Punya pertanyaan? Hubungi kami atau kirim pesan di bawah."
          />
        </Section>
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

