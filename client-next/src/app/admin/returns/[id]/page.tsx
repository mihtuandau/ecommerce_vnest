"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AdminReturnDetailView } from "@/features/returns";

export default function AdminReturnDetailPage() {
  const { id } = useParams() as { id: string };

  return <AdminReturnDetailView id={Number(id)} />;
}
