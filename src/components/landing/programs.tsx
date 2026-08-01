import Link from "next/link";
import { Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/landing/ui";
import { type Program } from "@/db/schema";
import { formatIDR } from "@/lib/format";

export function Programs({ programs }: { programs: Program[] }) {
  if (!programs.length) return null;
  return (
    <Section>
      <SectionHeader
        title="Program Unggulan"
        description="Program kerja luar negeri kami yang paling diminati."
      />
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
        {programs.map((p) => (
          <Card key={p.id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-[3/2] w-full rounded-lg bg-linear-to-br from-primary/25 via-primary/10 to-transparent" />
              <div className="mt-3 flex items-start justify-between gap-2">
                <CardTitle className="font-heading text-lg">{p.name}</CardTitle>
                {p.isFeatured && <Badge>Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              {p.salaryRange && (
                <p className="mb-2 text-sm font-medium">
                  Gaji:{" "}
                  <span className="text-muted-foreground">{p.salaryRange}</span>
                </p>
              )}
              {p.trainingDuration && (
                <p className="text-sm text-muted-foreground">
                  Durasi pelatihan: {p.trainingDuration}
                </p>
              )}
              {p.estimatedCost && (
                <p className="mt-1 text-sm">
                  Biaya:{" "}
                  <span className="font-medium">{formatIDR(p.estimatedCost)}</span>
                </p>
              )}
              <Link
                href={`/programs/${p.slug}`}
                className="mt-3 block text-sm font-medium text-primary"
              >
                Lihat detail program
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/programs"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          <Briefcase />
          Lihat semua program
        </Link>
      </div>
    </Section>
  );
}
