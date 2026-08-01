import { whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/landing/ui";

export function CTA() {
  return (
    <Section className="bg-linear-to-br from-primary via-primary/90 to-primary/80 py-16 text-primary-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
        <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
          Siap memulai karier internasional Anda?
        </h2>
        <p className="max-w-xl text-sm text-primary-foreground/80 sm:text-base">
          Hubungi kami sekarang untuk konsultasi gratis. Kami akan membantu
          Anda merencanakan masa depan yang lebih baik.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            variant="outline"
            render={
              <a
                href={whatsappLink("Saya ingin konsultasi program kerja luar negeri.")}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            Chat WhatsApp
          </Button>
        </div>
      </div>
    </Section>
  );
}
