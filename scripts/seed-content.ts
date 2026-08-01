import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  countries,
  jobCategories,
  programs,
  companies,
  testimonials,
  faqs,
} from "../src/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString, { prepare: false, max: 1 });
const db = drizzle(client);

async function seed() {
  console.log("Seeding countries...");
  const countryRows = [
    {
      name: "Jepang",
      slug: "jepang",
      code: "JP",
      flagEmoji: "🇯🇵",
      description:
        "Peluang kerja di industri manufaktur, perawatan lansia, dan pertanian dengan gaji kompetitif.",
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Korea Selatan",
      slug: "korea-selatan",
      code: "KR",
      flagEmoji: "🇰🇷",
      description:
        "Program kerja di sektor manufaktur dan perikanan dengan sistem visa resmi (E-9).",
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Taiwan",
      slug: "taiwan",
      code: "TW",
      flagEmoji: "🇹🇼",
      description:
        "Peluang di pabrik elektronik dan perawatan dengan gaji bulanan menarik.",
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "Jerman",
      slug: "jerman",
      code: "DE",
      flagEmoji: "🇩🇪",
      description:
        "Program perawat (Pflegekraft) dengan jalur bahasa dan penempatan resmi.",
      isActive: true,
      sortOrder: 4,
    },
    {
      name: "Malaysia",
      slug: "malaysia",
      code: "MY",
      flagEmoji: "🇲🇾",
      description:
        "Pilihan terdekat di sektor manufaktur, perkebunan, dan perhotelan.",
      isActive: true,
      sortOrder: 5,
    },
    {
      name: "Uni Emirat Arab",
      slug: "uae",
      code: "AE",
      flagEmoji: "🇦🇪",
      description:
        "Peluang di sektor perhotelan, retail, dan konstruksi dengan upah tinggi.",
      isActive: true,
      sortOrder: 6,
    },
  ];

  const insertedCountries = await db
    .insert(countries)
    .values(countryRows)
    .onConflictDoNothing()
    .returning();

  const countryMap = new Map(insertedCountries.map((c) => [c.slug, c.id]));
  console.log(`Countries: ${insertedCountries.length}`);

  console.log("Seeding job categories...");
  const categoryRows = [
    {
      name: "Manufaktur",
      slug: "manufaktur",
      description: "Produksi, perakitan, dan operator mesin",
      icon: "factory",
    },
    {
      name: "Perawat",
      slug: "perawat",
      description: "Perawatan lansia dan medis",
      icon: "stethoscope",
    },
    {
      name: "Perhotelan",
      slug: "perhotelan",
      description: "Housekeeping, F&B, dan pelayanan",
      icon: "hotel",
    },
    {
      name: "Pertanian",
      slug: "pertanian",
      description: "Perkebunan, peternakan, dan panen",
      icon: "sprout",
    },
    {
      name: "Perikanan",
      slug: "perikanan",
      description: "Pengolahan dan tangkap ikan",
      icon: "ship",
    },
    {
      name: "Konstruksi",
      slug: "konstruksi",
      description: "Bangunan dan infrastruktur",
      icon: "hammer",
    },
  ];

  const insertedCategories = await db
    .insert(jobCategories)
    .values(categoryRows)
    .onConflictDoNothing()
    .returning();

  const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));
  console.log(`Job categories: ${insertedCategories.length}`);

  console.log("Seeding programs...");
  const programRows = [
    {
      name: "Program Kerja Manufaktur Jepang",
      slug: "manufaktur-jepang",
      countryId: countryMap.get("jepang")!,
      categoryId: categoryMap.get("manufaktur")!,
      description:
        "Penempatan di pabrik manufaktur Jepang dengan gaji kompetitif dan asuransi lengkap.",
      salaryRange: "Rp 18–25 juta/bulan",
      workingHours: "8 jam/hari, 5 hari/minggu",
      visaInfo: "Visa Kerja (Technical Intern Training / Tokutei Ginou)",
      requirements: [
        "Usia 18–35 tahun",
        "Lulus SMA/sederajat",
        "Sehat jasmani dan rohani",
        "Bersedia belajar bahasa Jepang",
      ],
      trainingDuration: "3–6 bulan",
      estimatedCost: 45000000,
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      name: "Program Perawat Jerman (Pflegekraft)",
      slug: "perawat-jerman",
      countryId: countryMap.get("jerman")!,
      categoryId: categoryMap.get("perawat")!,
      description:
        "Program perawat profesional di Jerman dengan jalur bahasa B1/B2 dan penempatan di rumah sakit.",
      salaryRange: "Rp 30–45 juta/bulan",
      workingHours: "38,5 jam/minggu",
      visaInfo: "Visa Kerja Keterampilan (Fachkraft)",
      requirements: [
        "Usia 18–40 tahun",
        "D3/S1 Keperawatan atau lulusan SMA",
        "Kemampuan bahasa Jerman B1/B2",
        "Pengalaman perawat diutamakan",
      ],
      trainingDuration: "6–12 bulan",
      estimatedCost: 85000000,
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: "Program Kerja Korea Selatan (EPS-TOPIK)",
      slug: "kerja-korea-epstopik",
      countryId: countryMap.get("korea-selatan")!,
      categoryId: categoryMap.get("manufaktur")!,
      description:
        "Program penempatan resmi melalui jalur G to G dengan ujian EPS-TOPIK.",
      salaryRange: "Rp 25–35 juta/bulan",
      workingHours: "8 jam/hari, 5 hari/minggu",
      visaInfo: "Visa E-9 (Employment Permit System)",
      requirements: [
        "Usia 18–39 tahun",
        "Lulus ujian EPS-TOPIK",
        "Sehat dan bebas narkoba",
        "Tidak memiliki catatan kriminal",
      ],
      trainingDuration: "4–6 bulan",
      estimatedCost: 55000000,
      isActive: true,
      isFeatured: true,
      sortOrder: 3,
    },
    {
      name: "Program Kerja Taiwan (Manufaktur)",
      slug: "manufaktur-taiwan",
      countryId: countryMap.get("taiwan")!,
      categoryId: categoryMap.get("manufaktur")!,
      description:
        "Penempatan di pabrik elektronik dan komponen dengan gaji bulanan menarik.",
      salaryRange: "Rp 15–22 juta/bulan",
      workingHours: "8 jam/hari",
      visaInfo: "Visa Kerja (Industrial)",
      requirements: [
        "Usia 18–40 tahun",
        "Lulus SMA/sederajat",
        "Sehat jasmani dan rohani",
      ],
      trainingDuration: "2–3 bulan",
      estimatedCost: 35000000,
      isActive: true,
      isFeatured: false,
      sortOrder: 4,
    },
    {
      name: "Program Perhotelan UAE",
      slug: "perhotelan-uae",
      countryId: countryMap.get("uae")!,
      categoryId: categoryMap.get("perhotelan")!,
      description:
        "Peluang karier di hotel bintang 4–5 di Dubai dan Abu Dhabi.",
      salaryRange: "Rp 20–30 juta/bulan",
      workingHours: "8 jam/hari, 6 hari/minggu",
      visaInfo: "Visa Kerja (Residence)",
      requirements: [
        "Usia 20–35 tahun",
        "Komunikasi bahasa Inggris aktif",
        "Pengalaman perhotelan diutamakan",
        "Penampilan menarik",
      ],
      trainingDuration: "1–2 bulan",
      estimatedCost: 28000000,
      isActive: true,
      isFeatured: false,
      sortOrder: 5,
    },
  ];

  const insertedPrograms = await db
    .insert(programs)
    .values(programRows)
    .onConflictDoNothing()
    .returning();
  console.log(`Programs: ${insertedPrograms.length}`);

  console.log("Seeding companies...");
  const companyRows = [
    {
      name: "Toyota Industries",
      slug: "toyota-industries",
      industry: "Manufaktur Otomotif",
      countryId: countryMap.get("jepang")!,
      website: "https://www.toyota-industries.com",
      address: "Aichi, Jepang",
      description: "Produsen peralatan industri dan mesin terkemuka dunia.",
      isActive: true,
    },
    {
      name: "Charité Berlin",
      slug: "charite-berlin",
      industry: "Kesehatan",
      countryId: countryMap.get("jerman")!,
      website: "https://www.charite.de",
      address: "Berlin, Jerman",
      description: "Rumah sakit universitas terbesar di Eropa.",
      isActive: true,
    },
    {
      name: "Samsung Electronics",
      slug: "samsung-electronics",
      industry: "Elektronik",
      countryId: countryMap.get("korea-selatan")!,
      website: "https://www.samsung.com",
      address: "Gyeonggi, Korea Selatan",
      description: "Perusahaan elektronik global asal Korea Selatan.",
      isActive: true,
    },
    {
      name: "TSMC",
      slug: "tsmc",
      industry: "Semikonduktor",
      countryId: countryMap.get("taiwan")!,
      website: "https://www.tsmc.com",
      address: "Hsinchu, Taiwan",
      description: "Pabrik semikonduktor terbesar di dunia.",
      isActive: true,
    },
    {
      name: "Burj Al Arab Jumeirah",
      slug: "burj-al-arab",
      industry: "Perhotelan",
      countryId: countryMap.get("uae")!,
      website: "https://www.burjalarab.com",
      address: "Dubai, Uni Emirat Arab",
      description: "Hotel bintang tujuh ikonik di Dubai.",
      isActive: true,
    },
  ];

  const insertedCompanies = await db
    .insert(companies)
    .values(companyRows)
    .onConflictDoNothing()
    .returning();
  console.log(`Companies: ${insertedCompanies.length}`);

  console.log("Seeding testimonials...");
  await db
    .insert(testimonials)
    .values([
      {
        name: "Rizky Pratama",
        role: "Alumni Jepang 2024",
        countryId: countryMap.get("jepang")!,
        quote:
          "Proses dari pendaftaran sampai berangkat sangat dibantu tim LPK. Sekarang saya bekerja di pabrik manufaktur di Aichi dengan gaji yang jauh lebih baik.",
        rating: 5,
      },
      {
        name: "Siti Rahma",
        role: "Perawat di Jerman",
        countryId: countryMap.get("jerman")!,
        quote:
          "Program bahasa Jerman di LPK sangat terstruktur. Setelah 8 bulan, saya berhasil lolos B2 dan ditempatkan di rumah sakit di Berlin.",
        rating: 5,
      },
      {
        name: "Dedi Kurniawan",
        role: "Alumni Korea Selatan",
        countryId: countryMap.get("korea-selatan")!,
        quote:
          "Bimbingan EPS-TOPIK-nya luar biasa, banyak latihan soal dan simulasi. Saya lulus ujian percobaan pertama.",
        rating: 5,
      },
      {
        name: "Ayu Lestari",
        role: "Housekeeping di Dubai",
        countryId: countryMap.get("uae")!,
        quote:
          "Pelatihan bahasa Inggris dan persiapan interview sangat membantu. Sekarang saya bekerja di hotel bintang 5 di Dubai.",
        rating: 4,
      },
    ])
    .onConflictDoNothing();
  console.log("Testimonials seeded");

  console.log("Seeding FAQs...");
  await db
    .insert(faqs)
    .values([
      {
        question: "Apa saja syarat untuk mendaftar program kerja luar negeri?",
        answer:
          "Syarat umum: usia 18–40 tahun sesuai program, lulus SMA/sederajat, sehat jasmani dan rohani, serta bersedia mengikuti pelatihan yang disediakan. Persyaratan spesifik berbeda per negara dan program.",
        isActive: true,
        sortOrder: 1,
      },
      {
        question: "Berapa lama proses dari pendaftaran sampai keberangkatan?",
        answer:
          "Tergantung program dan negara tujuan. Rata-rata 3–6 bulan termasuk pelatihan bahasa, ujian keterampilan, dan proses visa.",
        isActive: true,
        sortOrder: 2,
      },
      {
        question: "Apakah biaya program bisa dicicil?",
        answer:
          "Ya, kami menyediakan skema pembayaran bertahap dan bisa berkoordinasi dengan lembaga pembiayaan mitra.",
        isActive: true,
        sortOrder: 3,
      },
      {
        question: "Apakah saya perlu bisa bahasa asing dulu?",
        answer:
          "Tidak perlu. Kami menyediakan pelatihan bahasa (Jepang, Jerman, Korea, Inggris) sebagai bagian dari program.",
        isActive: true,
        sortOrder: 4,
      },
      {
        question: "Bagaimana proses penempatan dan dukungan di luar negeri?",
        answer:
          "Kami mendampingi mulai dari penempatan, akomodasi, asuransi, hingga pendampingan di negara tujuan melalui mitra lokal kami.",
        isActive: true,
        sortOrder: 5,
      },
    ])
    .onConflictDoNothing();
  console.log("FAQs seeded");

  console.log("Content seed complete ✓");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
