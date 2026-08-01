import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";

import { siteConfig, whatsappLink } from "@/lib/site";

function SocialLink({
  href,
  label,
  svg,
}: {
  href: string;
  label: string;
  svg: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted-foreground hover:text-foreground"
    >
      {svg}
    </Link>
  );
}

export function Footer() {
  const linkGroups = [
    {
      title: "Perusahaan",
      links: [
        { label: "Tentang Kami", href: "/about" },
        { label: "Karir", href: "/careers" },
        { label: "Kontak", href: "/contact" },
        { label: "Privasi", href: "/privacy" },
      ],
    },
    {
      title: "Program",
      links: [
        { label: "Ke Jepang", href: "/countries/jepang" },
        { label: "Ke Korea", href: "/countries/korea-selatan" },
        { label: "Ke Jerman", href: "/countries/jerman" },
        { label: "Ke Malaysia", href: "/countries/malaysia" },
      ],
    },
    {
      title: "Layanan",
      links: [
        { label: "Berita", href: "/news" },
        { label: "FAQ", href: "/faq" },
        { label: "Testimoni", href: "/testimonials" },
        { label: "Galeri", href: "/gallery" },
      ],
    },
  ];

  const socialLinks = [
    {
      label: "Instagram",
      href: siteConfig.social.instagram,
      svg: (
        <svg
          className="size-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.3 1 .6 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.3.6-.6 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.3-1-.6-1.5-1-.5-.5-.9-.9-1-1.5-.2-.5-.4-1.2-.5-2.4-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.3-.6.6-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.4 2.4-.5 1.3-.1 1.7-.1 4.9-.1M12 0C8.7 0 8.3 0 7 0 5.7 0 4.4.2 3.4.6c-1 .5-1.9 1.4-2.6 2.6C.3 4.6 0 5.9 0 7.3 0 8.6 0 9 0 12s0 3.4.6 4.7c.6 1 1.5 1.9 2.6 2.6 1 .6 2.3.7 3.7.7 1.3 0 1.7.1 5 .1 3.3 0 3.7 0 5-.1 1.4-.1 2.7-.6 3.7-1.3.8-.8 1.5-1.6 2-2.6.7-1 .9-2.3.9-3.7.1-1.3.1-1.7.1-5s0-3.7-.1-5-.1-2.7-.6-3.7-.8-1.6-1.9-2.6C20.6.9 19.3 0 17.9 0c-1.1-.1-1.4-.1-5-.1z" />
          <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2A4 4 0 1 1 12 8a4 4 0 0 1 0 8zm6-12.3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: siteConfig.social.facebook,
      svg: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 320 512" aria-hidden>
          <path d="M279.14 427.91l-18.06-76.36c-.6-2.47-.4-4.25-.2-6.48 1.5-8.2 7.7-22.8 9.5-26.2.9-1.6 1.1-2 1.1-3.2 0-1.5-.2-6.2-3.5-9.9-3.8-4.2-8.2-8.2-8.2-8.2h-8.4v-75.1h15.5c3.4 0 4.9-1.5 4.9-3.6v-28.5c0-.8-.4-1.6-1.2-1.6-1.2-.05-6.4-.9-11.9-.9-5.6 0-7.9-.07-10.8-.1-2-.02-3.9-.1-6.8-.1v-65.8c0-2.2-.8-3.9-2.6-4.4-3.6-1-7.3-1.5-11.1-1.5-5.3 0-7.9 0-11.5.1-3.7.1-8.4.4-13.1 1.1-3.2.5-6 1.5-8.4 2.6-2 .8-4.2 2-5.2 3.3-.9 1.2-1.2 2.9-1.2 4.3v63.7c0 1.6-.9 2.6-2.4 2.9-1.5.4-3.1.5-4.7.6-3.3.1-4.5-.1-6.6-.2-2.4-.1-5.2 0-8.6.1-3.3.1-6.2-.1-8.6-.5-1.7-.3-3.8-.9-5.3-2.1-.5-.3-1-.6-1.4-1-1-1.3-1.4-3.2-1.4-5v-18.5c0-2.6 1.4-4.9 3.3-6 1.9-1 4.3-1.8 6.9-2.3 2.6-.4 5.3-.8 8-.8 2.9 0 4.7-.1 7.6.1 2.9.2 5.7.5 8.5 1 3.3.6 7.2 1.8 10.2 3.7 1.6 1 3.5 2 4.8 3.6 1.3 1.6 2.1 3.8 2.1 5.5v28.5c0 3.4.2 5.5.3 5.9 0 1.3.1 2 .1 3.2v84.6c0 1.5.1 2.6 2.4 2.6 1.6 0 3.4-.2 5.4-.5 2-.1 4-.5 6-1.1 2.5-.7 4.4-1.8 5.5-2 .3-.1.7-.1 1 .0 1.1.2 2.3.6 3.6 1.2.7.3 1.4.8 2 1.3.5.5 1.1 1.2 1.4 1.9.6 1.2 1.3 3.5 1.6 7.4l2.7 21.4c.3 2.4.6 4.8 1.3 6.8.6 1.9 1.5 3.8 2.5 5.6 1.1 1.8 2.3 3.6 3.7 5.2 1.4 1.7 3 3.2 4.7 4.2 1.6 1 3.3 1.8 5 2.3.9.2 1.7.4 2.5.5.7.1 2 .1 3.1-.1 1.2-.2 2.4-.8 3.2-1.8.9-1 1.1-2 1.1-3.2 0-.8-.2-1.5-.4-2.3z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: siteConfig.social.youtube,
      svg: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 576 512" aria-hidden>
          <path d="M549.655 164.27c-.66-.83-.63-1.24-.71-2.55C544.896 32.7 498.46 0 336.006 0 336.006 0 332.83 0 319.12 16.7c-6.98 7.35-13.2 16.37-18.77 26.8-2.58 4.95-5.3 10-7.95 14.8-.47.8-1.23 1.7-1.62 2.58-.38.85-.52 1.2-.76 1.99-2.49 8.1-2.46 8.05-2.53 13.78-.12 6.9-.3 12.83.13 19.67 0 .4-.07 1.1-.15 2.02L287.776 256l-.02 256.13c0 .4.07 1.1.15 2.02.43 6.84.6 12.77.13 19.67-.07 5.73-.04 5.69-2.53 13.78-.25.8-.38 1.13-.76 1.99-5.56 10.43-11.79 19.45-18.77 26.8-13.79 16.7-15.79 16.97-32.73 17.44-6.45 1.48-54.6.88-54.6.88s-.4-.01-1.2-.11c-4.68-.53-9.4-.89-14.12-.89-4.84 0-9.66.1-14.48.1-4.84 0-9.66-.1-14.48-.1-4.72 0-9.44.36-14.12.89-.8.1-1.2.1-1.2.11s-48.17-.6-54.6-.88c-16.95-.47-19.05-.75-32.73-17.44-6.98-7.35-13.2-16.37-18.77-26.8-.38-.8-.52-1.17-.76-1.99-.12-6.9-.3-12.83.13-19.67.07-.8.15-1.62.15-2.02V256.01l-.2-256.1c.07-.4.15-1.2.15-2.02.43-6.84.6-12.77.13-19.67-.07-5.73-.04-5.69-2.53-13.78C96.24 96.1 89.5 79.5 82.84 65.9c-.16-.34-.3-.66-.5-1.1C80.35 63 79.9 62.4 79.5 61.5 79.5 61.5 73 59.5 67 57 56.7 51.7 47.6 50.3 38.6 50.1c-4.5-.13-8.9-.2-13.2-.2-4.3 0-8.7.07-13.1.2-4.4.13-8.8.33-12.9.66-1.6.13-3.2.3-4.7.5-.9.1-1.7.2-2.4.4C.42 63.5 0 63.86 0 64.27v399.37c0 127.3 102.9 230.1 230 230.1 127.1 0 230-102.8 230-230V164.27c0-.24-.26-.7-.52-1.3-.7-.9-1.3-1.6-1.96-2.3z" />
          <path d="M95.3 181.7c-23.5 0-42.5-19-42.5-42.5S71.8 96.7 95.3 96.7c23.4 0 42.5 19 42.5 42.5 0 23.6-19 42.5-42.5 42.5zm352.2 170.7c0 24.9-20.1 45-45 45-24.9 0-45-20.1-45-45 0-24.8 20.1-44.9 45-44.9 24.8 0 45 20.1 45 44.9v45z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full border-t bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
                {siteConfig.shortName.charAt(0)}
              </span>
              <span className="font-heading text-lg font-bold">
                {siteConfig.shortName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
            <p className="text-sm text-muted-foreground">{siteConfig.address}</p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sen–Jum: 08.00–17.00 WIB</span>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="font-heading text-sm font-semibold">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold">Ikuti Kami</h3>
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <SocialLink key={s.label} {...s} />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Phone className="size-4 text-muted-foreground" />
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {siteConfig.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloatButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex size-13 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:scale-105 transition-transform"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.04 2.01C6.5 2.01 2 6.19 2 11.36c0 1.97.54 3.86 1.55 5.49L2 22l5.63-1.32c1.55.85 3.39 1.31 5.41 1.31 5.54 0 10.04-4.25 10.04-9.49 0-2.53-1.01-4.87-2.67-6.51a9.63 9.63 0 0 0-6.37-2.39h-.01zm5.1 13.55c-.28.79-1.65 1.44-2.26 1.57-.54.11-.64.09-.93.14l-1.31.2-.6.11c-.74-.29-1.26-.99-1.52-1.71-.25-.72-.29-1.32.18-2.09.41-.67 1.68-1.09 1.91-1.18.24-.09.42-.19.58-2.27v-2.96c-.19-.58-1.32-1.44-1.92-1.57-.59-.13-1.2-.13-1.39-.15-1.18-.11-1.98-.26-1.98-.72 0-.58 1.24-.78 1.95-1.23.65-.39 1.31.34 1.83.91.44.5.11 1.19.5 1.47.34.27.68.34 1.24.22.57-.12 1.82-.64 2.47-1.48.64-.84.83-2.1.45-3.19-.32-.95-1.18-1.89-2.35-1.89-1.03 0-1.91.34-2.59.86-.67.51-1.79 1.27-1.91 2.74-.12 1.45-.03 2.74.33 3.9.39 1.31 1.86 2.12 3.27 2.33.14.02 2.76 1.37 3.97 1.95.83.39 1.47.28 2.01.17.61-.12 1.81-.64 2.08-1.28.28-.64.45-1.36.45-2.13v-2.85c0-4.25-3.13-7.73-7.15-8.04-3.94-.31-7.34 2.71-8.18 6.59-1.09 4.92-.05 9.65 2.79 13.2 1.8 2.12 4.03 4.51 6.49 5.73 1.6.84 3.13 1.26 4.69 1.26 1.56 0 3.05-.39 4.11-1.03 1.3-.78 2.19-1.81 2.92-3.07.58-1.01 1.26-1.9 1.81-2.81.51-.87 1-1.8 1.41-2.74.3-.65.55-1.31.75-1.96.1-.31.2-.62.27-.95 0-.01.01-.03.02-.04v-.01c.02-2.01-1.52-3.66-3.47-3.67-1.95 0-3.57 1.6-3.6 3.55-.03 2.02 1.2 3.85 3.1 4.5 1.94.6 4 .26 5.34-.86 1.43-1.2 2.37-2.96 2.4-4.46.03-1.5-.71-2.92-2.2-3.5-1.49-.58-3.2-.05-4.05 1.65-1.8 3.43-2.8 7.4-2.6 10.5.1 1.7.1 3.3.1 4.9 0 1.6-.1 3.2-.2 4.8 0 2.4.1 4.8.2 7.2 0 .56.13 1.1.37 1.62 1.55.9.9 2.06 1.76 3.4 2.65 1.25.84 2.71 1.43 4.23 1.71 1.51.28 3.05.2 4.63-.1 1.57-.3 3.1-.87 4.47-1.75 1.41-.92 2.6-2.13 3.57-3.6.06-.1.1-.2.14-.3.04-.1.08-.2.1-.3v-.02c.04-2.06.2-4.12.2-6.18 0-3.74-.3-7.48-.9-11.18-.6-3.65-1.5-7.2-3.1-10.5-1.57-3.2-3.7-6-6.4-8.1-.3-.2-.6-.3-.9-.5-.15-.07-.3-.1-.45-.15-2.7-.5-5.2-1.1-7.4-.1-2.2.9-4.9 2.1-6.8 4.3-.3.2-.5.5-.7.8-.3.3-.5.7-.6 1 0 .4.3.8.7 1.1.4.2.7.4.9.7.2.3.3.6.5.9 0 .4.2.8.4 1.2.2.6.6 1.2 1.1 1.8.4.5 1 .9 1.5 1.4 0-.2.1-.5.2-.8.1-.4 0-.8 0-1.2 0-1.9-1.5-3.5-3-3.7-2.9-.3-3.9 1.5-3.9 3.4 0 2 1.4 3.6 3.5 3.9 2 .3 4.3-.2 5.8-1.7 1.5-1.5 2.2-3.8 1.9-5.7-.4-1.9-2.2-3.2-4.2-2.9-1.9.3-3.3 1.9-3.3 3.8 0 3.4 2.7 6.1 6 6.3 3.3.2 5.9-2.4 6.3-5.7.5-3.3-1.5-6.5-4.7-6.8-3.2-.3-5.8 1.7-6.5 4.7-.7 3.1.8 6.3 3.8 7.4 2.9 1.1 6 1 8.7-.3 2.8-1.2 4.8-3.5 5.8-6 .9-2.4 1.2-4.9 1.2-7.4z" />
      </svg>
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
