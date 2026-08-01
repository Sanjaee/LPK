import { type ColumnDef } from "@tanstack/react-table";
import type { Program, Company } from "@/db/schema";
import { programSchema } from "@/lib/validations";
import { type FieldConfig } from "@/components/admin/resource-form-dialog";

export const companyFields: FieldConfig[] = [
  { name: "name", label: "Nama", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "logo", label: "URL Logo", type: "text" },
  { name: "industry", label: "Industri", type: "text" },
  { name: "website", label: "Website", type: "text" },
  { name: "address", label: "Alamat", type: "textarea" },
  { name: "description", label: "Deskripsi", type: "textarea" },
  { name: "isActive", label: "Aktif", type: "switch" },
];

const yesNo = (v: unknown) => (v ? "Ya" : "Tidak");

export const companyColumns: ColumnDef<Company>[] = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "industry", header: "Industri" },
  { accessorKey: "website", header: "Website" },
  { accessorKey: "isActive", header: "Aktif", cell: (info) => yesNo(info.getValue()) },
];

export const programFields: FieldConfig[] = [
  { name: "name", label: "Nama Program", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "countryId", label: "Negara", type: "select", optionsUrl: "/api/options/countries" },
  { name: "categoryId", label: "Kategori", type: "select", optionsUrl: "/api/options/job-categories" },
  { name: "description", label: "Deskripsi", type: "textarea" },
  { name: "image", label: "URL Gambar", type: "text" },
  { name: "salaryRange", label: "Rentang Gaji", type: "text" },
  { name: "workingHours", label: "Jam Kerja", type: "text" },
  { name: "visaInfo", label: "Info Visa", type: "text" },
  { name: "trainingDuration", label: "Durasi Pelatihan", type: "text" },
  { name: "estimatedCost", label: "Biaya (IDR)", type: "number" },
  { name: "isActive", label: "Aktif", type: "switch" },
  { name: "isFeatured", label: "Unggulan", type: "switch" },
  { name: "sortOrder", label: "Urutan", type: "number" },
];

export const programColumns: ColumnDef<Program>[] = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "salaryRange", header: "Gaji" },
  { accessorKey: "trainingDuration", header: "Durasi" },
  { accessorKey: "estimatedCost", header: "Biaya" },
  { accessorKey: "isFeatured", header: "Unggulan", cell: (info) => yesNo(info.getValue()) },
  { accessorKey: "isActive", header: "Aktif", cell: (info) => yesNo(info.getValue()) },
];

export { programSchema };
