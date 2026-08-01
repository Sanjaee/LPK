import { StatCounter } from "@/components/landing/stat-counter";
import { Section, SectionHeader } from "@/components/landing/ui";
import { siteConfig } from "@/lib/site";

export function Stats() {
  return (
    <Section className="bg-muted/40">
      <SectionHeader
        title="Dipercaya ribuan calon pekerja"
        description="Capaian nyata kami dalam membuka lapangan kerja untuk tenaga Indonesia."
      />
      <div className="mx-auto grid w-full max-w-5xl grid-cols-2 justify-items-center gap-8 sm:grid-cols-4 sm:gap-4">
        <StatCounter value={siteConfig.stats.alumni} label="Alumni terbangkir" suffix="+" />
        <StatCounter value={siteConfig.stats.countries} label="Negara tujuan" suffix="+" />
        <StatCounter value={siteConfig.stats.partners} label="Mitra perusahaan" suffix="+" />
        <StatCounter value={siteConfig.stats.successRate} label="Tingkat keberhasilan" suffix="%" />
      </div>
    </Section>
  );
}
