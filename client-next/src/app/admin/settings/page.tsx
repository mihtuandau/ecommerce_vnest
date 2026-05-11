"use client";

import React from "react";
import { PermissionsContainer } from "@/features/permissions/components/PermissionsContainer";
import { usePermission } from "@/hooks/usePermission";
import { AccessDenied } from "@/components/ui/AccessDenied";

export default function AdminSettingsPage() {
  const { can } = usePermission();

  if (!can("settings.manage")) {
    return <AccessDenied permission="settings.manage" />;
  }

  return <PermissionsContainer />;
}
