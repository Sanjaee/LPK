import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard/dashboard-shell";
import { getUserPermissions, getRoleById } from "@/lib/rbac";

const STAFF_ROLES = ["super_admin", "admin", "staff", "instructor"];

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

  const role = user.roleId ? await getRoleById(user.roleId) : null;
  if (!role || !STAFF_ROLES.includes(role.slug)) {
    redirect("/apply/mine");
  }

  const permissions = await getUserPermissions(user.roleId);

  return (
    <DashboardShell
      user={user}
      permissions={permissions}
      roleLabel={role.name}
    >
      {children}
    </DashboardShell>
  );
}
