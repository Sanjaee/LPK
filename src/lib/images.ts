export const IMAGES = {
  hero: "/images/hero.jpg",
  about: "/images/about.jpg",
  newsDefault: "/images/news1.jpg",
  programDefault: "/images/factory.jpg",
  countryDefault: "/images/about.jpg",
  gallery: ["/images/gallery1.jpg", "/images/gallery2.jpg", "/images/uae.jpg", "/images/factory.jpg", "/images/hotel.jpg", "/images/nurse.jpg"],
} as const;

const COUNTRY_IMAGES: Record<string, string> = {
  jepang: "/images/japan.jpg",
  "korea-selatan": "/images/korea.jpg",
  taiwan: "/images/taiwan.jpg",
  jerman: "/images/germany.jpg",
  malaysia: "/images/malaysia.jpg",
  uae: "/images/uae.jpg",
};

export function countryImage(slug?: string | null): string {
  return (slug && COUNTRY_IMAGES[slug]) || IMAGES.countryDefault;
}
