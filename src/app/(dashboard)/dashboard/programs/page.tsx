"use client";
import { ResourceList } from "@/components/admin/resource-list";
import { programColumns, programFields, programSchema } from "@/config/resources/programs";
import { type Program } from "@/db/schema";

export default function ProgramsPage() {
  return (
    <ResourceList<Program>
      resource="programs"
      label="Program"
      columns={programColumns}
      fields={programFields}
      schema={programSchema}
    />
  );
}

