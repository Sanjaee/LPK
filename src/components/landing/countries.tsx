import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/landing/ui";
import { type Country } from "@/db/schema";
import { countryImage } from "@/lib/images";

export function Countries({ countries }: { countries: Country[] }) {
  if (!countries.length) {
    return null;
  }
  return (
    <Section className="bg-muted/40">
      <SectionHeader
        title="Negara Tujuan Unggulan"
        description="Dukungan resmi untuk tiap negara dengan jalur kerja yang jelas."
      />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
          <Card key={c.id} className="group transition-shadow hover:shadow-lg">
            <CardHeader className="p-0">
              <div className="relative aspect-[3/1] overflow-hidden rounded-t-xl">
                <Image
                  src={c.image || countryImage(c.slug)}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {c.flagEmoji && (
                  <span className="absolute top-2 left-2 text-3xl">{c.flagEmoji}</span>
                )}
              </div>
              <CardTitle className="mt-3 font-heading text-lg">
                {c.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">
                {c.description ?? `Peluang kerja di ${c.name} dengan gaji kompetitif.`}
              </CardDescription>
              <Link
                href={`/countries/${c.slug}`}
                className="mt-2 block text-sm font-medium text-primary"
              >
                Lihat detail
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
