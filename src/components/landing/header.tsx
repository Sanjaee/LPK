"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/lib/site";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isLoggedIn: boolean;
}

export function Header({ isLoggedIn }: HeaderProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const nav = [
    { label: "Beranda", href: "/" },
    { label: "Negara", href: "/countries" },
    { label: "Program", href: "/programs" },
    { label: "Berita", href: "/news" },
    { label: "Testimoni", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
    { label: "Kontak", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted",
                pathname === item.href && "bg-muted text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="hidden items-center gap-1.5 md:flex">
            {isLoggedIn ? (
              <Button size="sm" render={<Link href="/dashboard" />}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  render={<Link href="/login" />}
                >
                  Masuk
                </Button>
                <Button size="sm" render={<Link href="/register" />}>
                  Daftar
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              render={
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              WhatsApp
            </Button>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t md:hidden">
          <div className="flex flex-col gap-1 px-2 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted",
                  pathname === item.href && "bg-muted text-foreground"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
