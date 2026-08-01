"use client";
import { ResourceList } from "@/components/admin/resource-list";
import { userColumns, userFields, userSchema } from "@/config/resources/content";
import { type User } from "@/db/schema";

export default function UsersPage() {
  return (
    <ResourceList<User>
      resource="users"
      label="Pengguna"
      columns={userColumns}
      fields={userFields}
      schema={userSchema}
    />
  );
}

