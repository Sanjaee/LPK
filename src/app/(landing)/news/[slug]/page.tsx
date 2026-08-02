import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

import { Header } from "@/components/landing/header";
import { Footer, WhatsAppFloatButton } from "@/components/landing/footer";
import { Section, SectionHeader, Container } from "@/components/landing/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getNewsBySlug } from "@/lib/services/landing";
import { formatDate } from "@/lib/format";
import { IMAGES } from "@/lib/images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return {};
  return {
    title: news.title,
    description: news.excerpt ?? news.content,
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const news = await getNewsBySlug(slug);

  if (!news) {
    return (
      <>
        <Header isLoggedIn={!!session?.user} user={session?.user} />
        <Section>
          <SectionHeader title="Berita tidak ditemukan" />
        </Section>
        <Footer />
        <WhatsAppFloatButton />
      </>
    );
  }

  return (
    <>
      <Header isLoggedIn={!!session?.user} user={session?.user} />
      <main className="flex-1">
        <Section>
          <Container>
            <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Beranda</Link>
              <ArrowRight className="size-3" />
              <Link href="/news" className="hover:text-foreground">Berita</Link>
              <ArrowRight className="size-3" />
              <span className="text-foreground">{news.title}</span>
            </div>

            <div className="mb-2 flex items-center gap-2 text-xs">
              <Calendar className="size-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(news.publishedAt)}
              </span>
              <Badge variant="outline">{news.status}</Badge>
            </div>

            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {news.title}
            </h1>

            <div className="relative my-6 aspect-[3/1] w-full overflow-hidden rounded-xl">
              <Image
                src={news.coverImage || IMAGES.newsDefault}
                alt={news.title}
                fill
                className="object-cover"
              />
            </div>

            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            <div className="mt-8 flex gap-2">
              <Button render={<Link href="/news" />}>
                Lihat semua berita
              </Button>
              <Button
                variant="outline"
                render={
                  <a
                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(news.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Bagikan ke WhatsApp
              </Button>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  );
}
