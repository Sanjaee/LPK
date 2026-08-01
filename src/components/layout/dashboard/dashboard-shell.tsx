"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, LogOut, Settings, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/layout/dashboard/dashboard-sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { logout } from "@/lib/auth";
import { siteConfig } from "@/lib/site";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  permissions: string[];
  roleLabel?: string | null;
}

export function DashboardShell({
   children,
  user,
  permissions,
  roleLabel,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUiStore();

  const segment = pathname.split("/")[2] ?? "";
  const titleMap: Record<string, string> = {
    applicants: "Pelamar",
    countries: "Negara Tujuan",
    programs: "Program",
    companies: "Perusahaan Mitra",
    users: "Pengguna",
    news: "Berita",
    messages: "Pesan Kontak",
    reports: "Laporan",
    settings: "Pengaturan",
  };
  const title = titleMap[segment] ?? "Dashboard";

  const displayName = user.name ?? "Pengguna";

  const initials = displayName
    ? displayName
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-60 border-r bg-sidebar transition-all lg:block",
          sidebarCollapsed && "lg:w-14"
        )}
      >
        <DashboardSidebar permissions={permissions} roleLabel={roleLabel} />
      </aside>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col transition-all",
          sidebarCollapsed ? "lg:pl-14" : "lg:pl-60"
        )}
      >
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon-sm" className="lg:hidden" />}
            >
              <Menu className="size-4" />
              <span className="sr-only">Buka menu</span>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-60 p-0"
              showCloseButton={false}
            >
              <DashboardSidebar
                permissions={permissions}
                roleLabel={roleLabel}
              />
            </SheetContent>
          </Sheet>

          <h1 className="font-heading text-sm font-semibold tracking-tight sm:text-base">
            {title}
          </h1>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Button variant="ghost" size="icon-sm" aria-label="Notifikasi">
              <Bell className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="h-8 gap-2 px-1.5" />
                }
              >
                <Avatar size="sm">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={displayName} />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden max-w-32 truncate text-sm sm:block">
                  {displayName}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="truncate font-medium">{displayName}</span>
                      <span className="truncate text-xs font-normal text-muted-foreground">
                        {user.email ?? "tanpa email"}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard/applicants" />}>
                  <UserRound className="size-4" />
                  Status Saya
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
                  <Settings className="size-4" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/" />}>
                  <UserRound className="size-4" />
                  Lihat Situs
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
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>

        <footer className="px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {siteConfig.name}
        </footer>
      </div>
    </div>
  );
}
