import { ResourceList } from "@/components/admin/resource-list";
import { bannerColumns, bannerFields, bannerSchema } from "@/config/resources/content";
import { type Banner } from "@/db/schema";

export const metadata = {
  title: "Banner",
  description: "Kelola banner utama.",
};

export default function BannersPage() {
  return (
    <ResourceList<Banner>
      resource="banners"
      label="Banner"
      columns={bannerColumns}
      fields={bannerFields}
      schema={bannerSchema}
    />
  );
}
