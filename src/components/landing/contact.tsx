import { ContactForm } from "@/components/landing/contact-form";
import { siteConfig } from "@/lib/site";

export function Contact() {
  return (
    <section className="w-full">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16 lg:px-8">
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-bold tracking-tight">
            Hubungi Kami
          </h2>
          <p className="text-sm text-muted-foreground">
            Punya pertanyaan seputar program kerja luar negeri? Kirim pesan
            atau hubungi kami langsung di nomor berikut.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Alamat:</span>{" "}
              <span>{siteConfig.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Email:</span>{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:underline"
              >
                {siteConfig.email}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Telepon:</span>{" "}
              <a
                href={`tel:${siteConfig.phone}`}
                className="text-primary hover:underline"
              >
                {siteConfig.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Jam:</span>
              <span>Sen–Jum: 08.00–17.00 WIB</span>
            </p>
          </div>
          <div className="aspect-square w-full min-h-[240px] rounded-lg bg-linear-to-br from-primary/25 via-primary/10 to-transparent" />
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
