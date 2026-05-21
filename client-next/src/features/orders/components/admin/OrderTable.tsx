"use client";

import React from "react";
import { Order } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "./Columns";
import { OrderStatus } from "@/types/enums";

interface OrderTableProps {
  data: Order[];
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
}

export function OrderTable({ data, onUpdateStatus }: OrderTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="orderCode"
      hideSearch={true}
      meta={{ onUpdateStatus }}
    />
  );
}
