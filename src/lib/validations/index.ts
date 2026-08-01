import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subjek minimal 2 karakter").max(150),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(2000),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(50),
  email: z.string().email("Email tidak invalid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().optional(),
});

export const countrySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100),
  slug: z.string().min(2, "Slug minimal 2 karakter").max(100),
  code: z.string().length(2, "Kode negara 2 huruf").optional().or(z.literal("")),
  flagEmoji: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const programSchema = z.object({
  name: z.string().min(2).max(150),
  slug: z.string().min(2).max(150),
  countryId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  salaryRange: z.string().optional(),
  workingHours: z.string().optional(),
  visaInfo: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  trainingDuration: z.string().optional(),
  estimatedCost: z.number().int().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const companySchema = z.object({
  name: z.string().min(2).max(150),
  slug: z.string().min(2).max(150),
  logo: z.string().optional(),
  industry: z.string().optional(),
  countryId: z.string().uuid().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const newsSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  excerpt: z.string().optional(),
  content: z.string().min(2),
  coverImage: z.string().optional(),
  authorId: z.string().uuid().optional(),
  status: z.string().default("published"),
  publishedAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

export const bannerSchema = z.object({
  title: z.string().min(2).max(150),
  subtitle: z.string().optional(),
  image: z.string().min(1),
  link: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const faqSchema = z.object({
  question: z.string().min(2),
  answer: z.string().min(2),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const testimonialSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().optional(),
  avatar: z.string().optional(),
  quote: z.string().min(2),
  rating: z.number().int().min(0).max(5).default(5),
  countryId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  roleId: z.string().uuid().optional(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  password: z.string().min(6).optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
