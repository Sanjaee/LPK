import { ResourceList } from "@/components/admin/resource-list";
import { faqColumns, faqFields, faqSchema } from "@/config/resources/content";
import { type Faq } from "@/db/schema";

export const metadata = {
  title: "FAQ",
  description: "Kelola pertanyaan umum.",
};

export default function FaqsPage() {
  return (
    <ResourceList<Faq>
      resource="faqs"
      label="FAQ"
      columns={faqColumns}
      fields={faqFields}
      schema={faqSchema}
    />
  );
}
