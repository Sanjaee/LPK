"use client";
import { ResourceList } from "@/components/admin/resource-list";
import { companyColumns, companyFields, companySchema } from "@/config/resources/content";
import { type Company } from "@/db/schema";

export default function CompaniesPage() {
  return (
    <ResourceList<Company>
      resource="companies"
      label="Perusahaan"
      columns={companyColumns}
      fields={companyFields}
      schema={companySchema}
    />
  );
}

