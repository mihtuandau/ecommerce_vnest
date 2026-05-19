"use client";

import React, { useState, useEffect } from "react";
import { returnsApi } from "@/features/returns/api";
import { useToast } from "@/hooks/useToast";
import { ReturnsToolbar } from "@/features/returns/components/admin/ReturnsToolbar";
import { ReturnsTable } from "@/features/returns/components/admin/ReturnsTable";
import { ReturnPolicyCard } from "@/features/returns/components/admin/ReturnPolicyCard";

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const { success, error } = useToast();

  const fetchReturns = async () => {
    setIsLoading(true);
    try {
      const res = await returnsApi.getAllReturns({
        status: filterStatus || undefined,
        limit: 100,
      } as any);
      setReturns(res.data || []);
    } catch (err) {
      error("Không thể tải danh sách yêu cầu trả hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await returnsApi.updateReturnStatus(id, { status });
      success("Đã cập nhật trạng thái");
      fetchReturns();
    } catch (err) {
      error("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ReturnsToolbar filterStatus={filterStatus} onFilterChange={setFilterStatus} />
      <ReturnsTable returns={returns} isLoading={isLoading} onUpdateStatus={handleUpdateStatus} />
      <ReturnPolicyCard />
    </div>
  );
}
