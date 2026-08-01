"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { dashboardNav, type NavItem } from "@/config/nav";
import { siteConfig } from "@/lib/site";
import { useUiStore } from "@/stores/ui-store";

export function DashboardSidebar({
  permissions,
  roleLabel,
}: {
  permissions: string[];
  roleLabel?: string | null;
}) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUiStore();

  const visibleSections = dashboardNav
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !item.permissions?.length ||
          item.permissions.some((p) => permissions.includes(p))
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 px-4">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
          {siteConfig.shortName.charAt(0)}
        </span>
        {!sidebarCollapsed && (
          <span className="font-heading text-sm font-semibold tracking-tight whitespace-nowrap">
            {siteConfig.shortName}
          </span>
        )}
      </div>
      <Separator className="mx-4 w-auto" />
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-5">
          {visibleSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <p className="px-2 text-[0.65rem] font-medium tracking-wider text-muted-foreground/70 uppercase">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <Separator className="mx-4 w-auto" />
      <div className="flex flex-col gap-2 p-3">
        {!sidebarCollapsed && roleLabel && (
          <p className="px-2 text-xs text-muted-foreground">{roleLabel}</p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-muted-foreground"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
          {!sidebarCollapsed && "Sembunyikan menu"}
        </Button>
      </div>
    </div>
  );
}

function SidebarItem({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
      title={collapsed ? item.title : undefined}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
    </Link>
  );
}
