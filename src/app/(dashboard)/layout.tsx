import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard/dashboard-shell";
import { getUserPermissions, getRoleById } from "@/lib/rbac";
import { ROLE_SLUGS } from "@/lib/permissions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  const permissions = await getUserPermissions(user.roleId);

  let roleLabel: string | null = null;
  if (user.roleId) {
    const role = await getRoleById(user.roleId);
    roleLabel = role?.name ?? null;
  }

  return (
    <DashboardShell
      user={user}
      permissions={permissions}
      roleLabel={roleLabel}
    >
      {children}
    </DashboardShell>
  );
}
