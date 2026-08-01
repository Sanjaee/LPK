import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { getLandingData } from "@/lib/services/landing";
import { formatDate } from "@/lib/format";
import { IMAGES } from "@/lib/images";

export const metadata = {
  title: "Berita",
  description: "Berita dan informasi terbaru dari LPK kami.",
};

export default async function NewsListPage() {
  const session = await auth();
  const data = await getLandingData();

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1">
        <Section>
          <SectionHeader
            title="Berita & Informasi"
            description="Update terbaru seputar program dan lowongan kerja luar negeri."
          />
          <Container>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.news.map((n) => (
                <Card key={n.id} className="flex flex-col group">
                  <CardHeader>
                    <Link href={`/news/${n.slug}`} className="relative block aspect-[3/1] w-full overflow-hidden rounded-t-xl">
                      <Image
                        src={n.coverImage || IMAGES.newsDefault}
                        alt={n.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </Link>
                    <CardTitle className="mt-3 font-heading text-lg group-hover:text-primary">
                      <Link href={`/news/${n.slug}`}>{n.title}</Link>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(n.publishedAt)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {n.excerpt ?? n.content}
                    </p>
                    <Link
                      href={`/news/${n.slug}`}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary"
                    >
                      Baca selengkapnya
                      <ArrowRight className="size-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}

