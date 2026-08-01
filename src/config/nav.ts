import {
  Briefcase,
  Building2,
  Globe2,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings,
  Users,
  UserRound,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permissions?: string[];
}export interface NavSection {
  title: string;
  items: NavItem[];
}

export const dashboardNav: NavSection[] = [
  {
    title: "Utama",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permissions: ["dashboard.view"],
      },
      {
        title: "Pelamar",
        href: "/dashboard/applicants",
        icon: Users,
        permissions: ["applicant.view"],
      },
      {
        title: "Laporan",
        href: "/dashboard/reports",
        icon: BarChart3,
        permissions: ["report.view"],
      },
    ],
  },
  {
    title: "Manajemen",
    items: [
      {
        title: "Negara",
        href: "/dashboard/countries",
        icon: Globe2,
        permissions: ["country.view"],
      },
      {
        title: "Program",
        href: "/dashboard/programs",
        icon: Briefcase,
        permissions: ["program.view"],
      },
      {
        title: "Perusahaan",
        href: "/dashboard/companies",
        icon: Building2,
        permissions: ["company.view"],
      },
      {
        title: "Pengguna",
        href: "/dashboard/users",
        icon: UserRound,
        permissions: ["user.view"],
      },
    ],
  },
  {
    title: "Konten",
    items: [
      {
        title: "Berita",
        href: "/dashboard/news",
        icon: Newspaper,
        permissions: ["news.view"],
      },
      {
        title: "Pesan Kontak",
        href: "/dashboard/messages",
        icon: MessageSquare,
        permissions: ["message.view"],
      },
    ],
  },
  {
    title: "Sistem",
    items: [
      {
        title: "Pengaturan",
        href: "/dashboard/settings",
        icon: Settings,
        permissions: ["settings.update"],
      },
    ],
  },
];
