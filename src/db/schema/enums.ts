import { pgEnum } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const maritalStatusEnum = pgEnum("marital_status", [
  "single",
  "married",
  "divorced",
  "widowed",
]);

export const applicantStatusEnum = pgEnum("applicant_status", [
  "draft",
  "submitted",
  "document_review",
  "interview",
  "medical_check",
  "training",
  "visa_process",
  "departure",
  "overseas",
  "completed",
  "rejected",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "approved",
  "rejected",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "photo",
  "ktp",
  "kk",
  "passport",
  "birth_certificate",
  "diploma",
  "certificate",
  "other",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
]);

export const galleryTypeEnum = pgEnum("gallery_type", ["photo", "video"]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "success",
  "warning",
  "error",
]);
