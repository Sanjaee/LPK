import { ResourceList } from "@/components/admin/resource-list";
import { countryColumns, countryFields, countrySchema } from "@/config/resources/countries";
import { type Country } from "@/db/schema";

export const metadata = {
  title: "Negara Tujuan",
  description: "Kelola negara tujuan kerja luar negeri.",
};

export default function CountriesPage() {
  return (
    <ResourceList<Country>
      resource="countries"
      label="Negara"
      columns={countryColumns}
      fields={countryFields}
      schema={countrySchema}
    />
  );
}
