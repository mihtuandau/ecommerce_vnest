"use client";

import React from "react";
import { Order } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { columns } from "./OrdersColumns";
import { OrderStatus } from "@/types/enums";

interface OrdersTableProps {
  data: Order[];
  onUpdateStatus?: (id: string, status: OrderStatus) => void;
}

export function OrdersTable({ data, onUpdateStatus }: OrdersTableProps) {
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
