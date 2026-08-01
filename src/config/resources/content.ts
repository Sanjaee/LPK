import { type ColumnDef } from "@tanstack/react-table";
import type { News, Faq, Banner, Testimonial, Company, User } from "@/db/schema";
import { newsSchema, faqSchema, bannerSchema, testimonialSchema, userSchema, companySchema } from "@/lib/validations";
import { type FieldConfig } from "@/components/admin/resource-form-dialog";

const yesNo = (v: unknown) => (v ? "Ya" : "Tidak");

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

export const companyColumns: ColumnDef<Company>[] = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "industry", header: "Industri" },
  { accessorKey: "website", header: "Website" },
  { accessorKey: "isActive", header: "Aktif", cell: (info) => yesNo(info.getValue()) },
];

export const newsFields: FieldConfig[] = [
  { name: "title", label: "Judul", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "excerpt", label: "Ringkasan", type: "textarea" },
  { name: "content", label: "Konten", type: "textarea" },
  { name: "coverImage", label: "URL Sampul", type: "text" },
  { name: "authorId", label: "Penulis", type: "select", optionsUrl: "/api/options/users" },
  { name: "status", label: "Status", type: "select", options: [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Terbit" },
  ] },
  { name: "publishedAt", label: "Dipublikasi Pada", type: "date" },
];

export const newsColumns: ColumnDef<News>[] = [
  { accessorKey: "title", header: "Judul" },
  { accessorKey: "status", header: "Status" },
];

export const faqFields: FieldConfig[] = [
  { name: "question", label: "Pertanyaan", type: "textarea", required: true },
  { name: "answer", label: "Jawaban", type: "textarea", required: true },
  { name: "isActive", label: "Aktif", type: "switch" },
  { name: "sortOrder", label: "Urutan", type: "number" },
];

export const faqColumns: ColumnDef<Faq>[] = [
  { accessorKey: "question", header: "Pertanyaan" },
  { accessorKey: "isActive", header: "Aktif", cell: (info) => yesNo(info.getValue()) },
];

export const bannerFields: FieldConfig[] = [
  { name: "title", label: "Judul", type: "text", required: true },
  { name: "subtitle", label: "Subjudul", type: "text" },
  { name: "image", label: "URL Gambar", type: "text", required: true },
  { name: "link", label: "Link", type: "text" },
  { name: "isActive", label: "Aktif", type: "switch" },
];

export const bannerColumns: ColumnDef<Banner>[] = [
  { accessorKey: "title", header: "Judul" },
  { accessorKey: "isActive", header: "Aktif", cell: (info) => yesNo(info.getValue()) },
];

export const testimonialFields: FieldConfig[] = [
  { name: "name", label: "Nama", type: "text", required: true },
  { name: "role", label: "Peran", type: "text" },
  { name: "avatar", label: "URL Avatar", type: "text" },
  { name: "quote", label: "Kutipan", type: "textarea", required: true },
  { name: "rating", label: "Rating", type: "number" },
  { name: "countryId", label: "Negara", type: "select", optionsUrl: "/api/options/countries" },
  { name: "isActive", label: "Aktif", type: "switch" },
];

export const testimonialColumns: ColumnDef<Testimonial>[] = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "isActive", header: "Aktif", cell: (info) => yesNo(info.getValue()) },
];

export const userFields: FieldConfig[] = [
  { name: "name", label: "Nama", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "phone", label: "Telepon", type: "text" },
  { name: "roleId", label: "Role", type: "select", optionsUrl: "/api/options/roles" },
  { name: "status", label: "Status", type: "select", options: [
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Nonaktif" },
    { value: "suspended", label: "Suspend" },
  ] },
];

export const userColumns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "status", header: "Status" },
];

export { newsSchema, faqSchema, bannerSchema, testimonialSchema, userSchema, companySchema };
