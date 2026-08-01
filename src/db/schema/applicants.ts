import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { programs } from "./content";
import {
  applicantStatusEnum,
  documentStatusEnum,
  documentTypeEnum,
  genderEnum,
  maritalStatusEnum,
} from "./enums";

export const applicants = pgTable(
  "applicants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    programId: uuid("program_id").references(() => programs.id),

    fullName: text("full_name").notNull(),
    nik: text("nik"),
    passportNo: text("passport_no"),
    kkNo: text("kk_no"),
    birthCertNo: text("birth_cert_no"),

    gender: genderEnum("gender"),
    placeOfBirth: text("place_of_birth"),
    dateOfBirth: text("date_of_birth"),
    religion: text("religion"),
    maritalStatus: maritalStatusEnum("marital_status"),
    bloodType: text("blood_type"),
    heightCm: integer("height_cm"),
    weightKg: integer("weight_kg"),

    email: text("email").notNull(),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    emergencyName: text("emergency_name"),
    emergencyPhone: text("emergency_phone"),

    province: text("province"),
    city: text("city"),
    district: text("district"),
    subDistrict: text("sub_district"),
    postalCode: text("postal_code"),
    address: text("address"),

    school: text("school"),
    major: text("major"),
    gradYear: integer("grad_year"),
    lastEducation: text("last_education"),

    workCompany: text("work_company"),
    workPosition: text("work_position"),
    workYears: integer("work_years"),

    skills: text("skills").array(),
    languages: text("languages").array(),
    certificates: text("certificates").array(),
    photoUrl: text("photo_url"),

    status: applicantStatusEnum("status").notNull().default("draft"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("applicants_status_idx").on(table.status),
    index("applicants_user_idx").on(table.userId),
    index("applicants_program_idx").on(table.programId),
  ]
);

export const applicantDocuments = pgTable(
  "applicant_documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    applicantId: uuid("applicant_id")
      .notNull()
      .references(() => applicants.id, { onDelete: "cascade" }),
    type: documentTypeEnum("type").notNull(),
    fileUrl: text("file_url").notNull(),
    originalName: text("original_name"),
    mimeType: text("mime_type"),
    size: integer("size"),
    status: documentStatusEnum("status").notNull().default("pending"),
    reviewNote: text("review_note"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("applicant_documents_applicant_idx").on(table.applicantId)]
);

export const applicationStatusHistory = pgTable(
  "application_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    applicantId: uuid("applicant_id")
      .notNull()
      .references(() => applicants.id, { onDelete: "cascade" }),
    fromStatus: applicantStatusEnum("from_status"),
    toStatus: applicantStatusEnum("to_status").notNull(),
    note: text("note"),
    changedBy: uuid("changed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("application_status_history_applicant_idx").on(table.applicantId)]
);

export type Applicant = typeof applicants.$inferSelect;
export type NewApplicant = typeof applicants.$inferInsert;
export type ApplicantDocument = typeof applicantDocuments.$inferSelect;
export type NewApplicantDocument = typeof applicantDocuments.$inferInsert;
export type ApplicationStatusHistory = typeof applicationStatusHistory.$inferSelect;
export type NewApplicationStatusHistory = typeof applicationStatusHistory.$inferInsert;
