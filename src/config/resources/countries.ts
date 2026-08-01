import { type ColumnDef } from "@tanstack/react-table";
import type { Country } from "@/db/schema";
import { countrySchema } from "@/lib/validations";
import { type FieldConfig } from "@/components/admin/resource-form-dialog";

export const countryFields: FieldConfig[] = [
  { name: "name", label: "Nama", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "code", label: "Kode", type: "text" },
  { name: "flagEmoji", label: "Bendera", type: "text" },
  { name: "image", label: "URL Gambar", type: "text" },
  { name: "description", label: "Deskripsi", type: "textarea" },
  { name: "isActive", label: "Aktif", type: "switch" },
  { name: "sortOrder", label: "Urutan", type: "number" },
];

const yesNo = (v: unknown) => (v ? "Ya" : "Tidak");

export const countryColumns: ColumnDef<Country>[] = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "slug", header: "Slug" },
  { accessorKey: "code", header: "Kode" },
  { accessorKey: "flagEmoji", header: "Bendera" },
  { accessorKey: "isActive", header: "Aktif", cell: (info) => yesNo(info.getValue()) },
  { accessorKey: "sortOrder", header: "Urutan" },
];

export { countrySchema };
