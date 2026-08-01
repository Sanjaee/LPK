export const ROLE_SLUGS = {
  superAdmin: "super_admin",
  admin: "admin",
  staff: "staff",
  instructor: "instructor",
  student: "student",
} as const;

export const PERMISSIONS = {
  // Users & RBAC
  userView: "user.view",
  userCreate: "user.create",
  userUpdate: "user.update",
  userDelete: "user.delete",
  roleView: "role.view",
  roleUpdate: "role.update",
  // Countries
  countryView: "country.view",
  countryCreate: "country.create",
  countryUpdate: "country.update",
  countryDelete: "country.delete",
  // Programs
  programView: "program.view",
  programCreate: "program.create",
  programUpdate: "program.update",
  programDelete: "program.delete",
  // Companies
  companyView: "company.view",
  companyCreate: "company.create",
  companyUpdate: "company.update",
  companyDelete: "company.delete",
  // Applicants
  applicantView: "applicant.view",
  applicantCreate: "applicant.create",
  applicantUpdate: "applicant.update",
  applicantDelete: "applicant.delete",
  applicantDocumentReview: "applicant.document_review",
  applicantStatusUpdate: "applicant.status_update",
  // Content
  newsView: "news.view",
  newsCreate: "news.create",
  newsUpdate: "news.update",
  newsDelete: "news.delete",
  bannerView: "banner.view",
  bannerCreate: "banner.create",
  bannerUpdate: "banner.update",
  bannerDelete: "banner.delete",
  galleryView: "gallery.view",
  galleryCreate: "gallery.create",
  galleryUpdate: "gallery.update",
  galleryDelete: "gallery.delete",
  testimonialView: "testimonial.view",
  testimonialCreate: "testimonial.create",
  testimonialUpdate: "testimonial.update",
  testimonialDelete: "testimonial.delete",
  faqView: "faq.view",
  faqCreate: "faq.create",
  faqUpdate: "faq.update",
  faqDelete: "faq.delete",
  // Misc
  dashboardView: "dashboard.view",
  reportView: "report.view",
  settingsUpdate: "settings.update",
} as const;

export const MODULES = [
  "user",
  "role",
  "country",
  "program",
  "company",
  "applicant",
  "news",
  "banner",
  "gallery",
  "testimonial",
  "faq",
  "dashboard",
  "report",
  "settings",
] as const;

export const PERMISSION_DEFS = Object.values(PERMISSIONS);
