import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeader } from "@/components/landing/ui";
import { type Faq } from "@/db/schema";

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;

  return (
    <Section>
      <SectionHeader
        title="Pertanyaan yang sering ditanyakan"
        description="Temukan jawaban untuk pertanyaan umum seputar program kami."
      />
      <div className="mx-auto w-full max-w-3xl">
        <Accordion defaultValue={faqs[0]?.id ? [faqs[0].id] : undefined} className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-left font-medium">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

export const FAQ = FaqSection;
