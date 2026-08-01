import { ResourceList } from "@/components/admin/resource-list";
import { newsColumns, newsFields, newsSchema } from "@/config/resources/content";
import { type News } from "@/db/schema";

export const metadata = {
  title: "Berita",
  description: "Kelola berita dan artikel.",
};

export default function NewsAdminPage() {
  return (
    <ResourceList<News>
      resource="news"
      label="Berita"
      columns={newsColumns}
      fields={newsFields}
      schema={newsSchema}
    />
  );
}
