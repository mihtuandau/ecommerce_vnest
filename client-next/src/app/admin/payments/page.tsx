"use client";

import React from "react";
import { PaymentsContainer } from "@/features/payments";
import { usePermission } from "@/hooks/usePermission";
import { AccessDenied } from "@/components/ui/AccessDenied";

export default function AdminPaymentsPage() {
  const { can } = usePermission();

  // Guard the page with payment.view or settings.manage permission
  if (!can("payment.view") && !can("settings.manage")) {
    return <AccessDenied permission="payment.view" />;
  }

  return <PaymentsContainer />;
}
