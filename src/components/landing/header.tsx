"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, UserRound } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isLoggedIn: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function Header({ isLoggedIn, user }: HeaderProps) {
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

  const displayName = user?.name ?? "Pengguna";
  const initials = displayName
    ? displayName
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "U";

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

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <Button size="sm" render={<Link href="/apply" />}>
            Daftar Kerja
          </Button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="h-8 gap-2 px-1.5" />
                }
              >
                <Avatar size="sm">
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={displayName} />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden max-w-28 truncate text-sm sm:block">
                  {displayName}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="truncate font-medium">{displayName}</span>
                      <span className="truncate text-xs font-normal text-muted-foreground">
                        {user?.email ?? "tanpa email"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/apply/mine" />}>
                  <UserRound className="size-4" />
                  Status Saya
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={logout}>
                  <DropdownMenuItem
                    variant="destructive"
                    render={<button type="submit" className="w-full" />}
                  >
                    <LogOut className="size-4" />
                    Keluar
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="ghost" render={<Link href="/login" />}>
              Masuk
            </Button>
          )}

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
            <div className="mt-2 border-t pt-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/apply"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Daftar Kerja
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/apply/mine"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setMenuOpen(false)}
                  >
                    Status Saya
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                    >
                      Keluar
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    onClick={() => setMenuOpen(false)}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/apply"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Daftar Kerja
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
