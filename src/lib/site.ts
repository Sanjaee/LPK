export const siteConfig = {
  name: "LPK Bina Karya Nusantara",
  shortName: "LPK BKN",
  tagline: "Jembatan Karier Anda Menuju Dunia Internasional",
  description:
    "Lembaga Pelatihan Kerja profesional yang mempersiapkan tenaga kerja Indonesia berkualitas untuk bekerja di luar negeri secara resmi dan legal.",
  url: "https://lpk-bina-karya-nusantara.com",
  address: "Jl. Contoh Raya No. 123, Jakarta Selatan, Indonesia",
  email: "info@lpk.com",
  phone: "+6281234567890",
  whatsapp: "6281234567890",
  whatsappMessage:
    "Halo admin LPK Bina Karya Nusantara, saya ingin bertanya tentang program kerja luar negeri.",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    tiktok: "https://tiktok.com",
  },
  stats: {
    alumni: 1247,
    countries: 6,
    partners: 38,
    successRate: 98,
  },
} as const;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
}
