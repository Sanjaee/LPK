import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { WhyUs } from "@/components/landing/why-us";
import { Countries } from "@/components/landing/countries";
import { Programs } from "@/components/landing/programs";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Contact } from "@/components/landing/contact";
import { FAQ } from "@/components/landing/faq";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { getLandingData, getFeaturedPrograms } from "@/lib/services/landing";
import { auth } from "@/auth";

export default async function HomePage() {
  const [session, data, featured] = await Promise.all([
    auth(),
    getLandingData(),
    getFeaturedPrograms(3),
  ]);

  const isLoggedIn = !!session?.user;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        <Hero isLoggedIn={isLoggedIn} />
        <Stats />
        <WhyUs />
        <Countries countries={data.countries} />
        <Programs programs={featured} />
        <Testimonials testimonials={data.testimonials} />
        <FAQ faqs={data.faqs} />
        <CTA />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
