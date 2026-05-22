"use client";

import React, { useState } from "react";
import { useReturns } from "@/features/returns/hooks";
import { ReturnsToolbar } from "@/features/returns/components/admin/ReturnsToolbar";
import { ReturnsTable } from "@/features/returns/components/admin/ReturnsTable";
import { ReturnPolicyCard } from "@/features/returns/components/admin/ReturnPolicyCard";

export function AdminReturnsListView() {
  const [filterStatus, setFilterStatus] = useState("");
  const { data, isLoading } = useReturns({
    status: filterStatus || undefined,
    limit: 100,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ReturnsToolbar
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />
      <ReturnsTable returns={data?.data || []} isLoading={isLoading} />
      <ReturnPolicyCard />
    </div>
  );
}
