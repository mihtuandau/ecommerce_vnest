"use client";

import React from "react";
import { PermissionsContainer } from "@/features/permissions/components/PermissionsContainer";
import { usePermission } from "@/hooks/usePermission";
import { AccessDenied } from "@/components/ui/AccessDenied";

export default function AdminPermissionsPage() {
  const { can } = usePermission();

  if (!can("user.manage") && !can("settings.manage")) {
    return <AccessDenied permission="user.manage" />;
  }

  return <PermissionsContainer />;
}
