import { ResourceList } from "@/components/admin/resource-list";
import { testimonialColumns, testimonialFields, testimonialSchema } from "@/config/resources/content";
import { type Testimonial } from "@/db/schema";

export const metadata = {
  title: "Testimonial",
  description: "Kelola testimonial.",
};

export default function TestimonialsAdminPage() {
  return (
    <ResourceList<Testimonial>
      resource="testimonials"
      label="Testimonial"
      columns={testimonialColumns}
      fields={testimonialFields}
      schema={testimonialSchema}
    />
  );
}
