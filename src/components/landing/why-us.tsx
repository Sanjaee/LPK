import { Shield, Globe, Users, FileCheck, Clock, Award } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/landing/ui";

const features = [
  {
    title: "Legal Resmi & Terjamin",
    description: "Proses melalui regulasi resmi pemerintah dan mitra kami di luar negeri.",
    icon: Shield,
  },
  {
    title: "Rekap Negara Pilihan",
    description: "Pilihan program ke 6 negara dengan peluang terbuka: Jepang, Korea, Jerman, Taiwan, Malaysia, dan UAE.",
    icon: Globe,
  },
  {
    title: "Bimbingan Materi & Psikotes",
    description: "Persiapan bahasa dan psychometric test dilakukan oleh tim terlatih.",
    icon: Users,
  },
  {
    title: "Dokumen Lengkap Kami Siapkan",
    description: "Bantu pengurusan paspor, visa, akta, hingga dokumen medis secara profesional.",
    icon: FileCheck,
  },
  {
    title: "Layan Berkelanjutan",
    description: "Pendampingan dari awal hingga akhir, termasuk pasca keberangkatan.",
    icon: Clock,
  },
  {
    title: "Track Record Teruji",
    description: "Ribuan alumni berhasil dan terdaftar dengan skema transparan dan terpercaya.",
    icon: Award,
  },
];

export function WhyUs() {
  return (
    <Section>
      <SectionHeader
        title="Kenapa memilih LPK Bina Karya Nusantara?"
        description="Kami hadir untuk menjadi jembatan karier Indonesia ke mancanegara."
      />
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="border border-border">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="font-heading text-base">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
