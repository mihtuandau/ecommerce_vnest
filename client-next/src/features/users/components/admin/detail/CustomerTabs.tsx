"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ShoppingBag, MapPin, Star, UserCog } from "lucide-react";
import { CustomerOrders } from "./CustomerOrders";
import { CustomerAddresses } from "./CustomerAddresses";
import { CustomerReviews } from "./CustomerReviews";
import { UserForm } from "../UserForm";
import { User } from "@/types/models";

interface CustomerTabsProps {
  user: User;
  activeTab: string;
  onTabChange: (value: string) => void;
  onUpdate: (data: any) => void;
  isUpdating: boolean;
}

export function CustomerTabs({ user, activeTab, onTabChange, onUpdate, isUpdating }: CustomerTabsProps) {
  const customer = user as any;
  const orders = customer.orders || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="px-6 py-4 border-b border-slate-100">
          <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200 h-auto gap-1">
            <TabsTrigger 
              value="orders" 
              className="rounded-lg px-6 py-2 text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all gap-2"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger 
              value="addresses" 
              className="rounded-lg px-6 py-2 text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all gap-2"
            >
              <MapPin className="h-3.5 w-3.5" />
              Địa chỉ
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-lg px-6 py-2 text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all gap-2"
            >
              <Star className="h-3.5 w-3.5" />
              Đánh giá
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-lg px-6 py-2 text-xs font-bold text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all gap-2"
            >
              <UserCog className="h-3.5 w-3.5" />
              Thiết lập
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="orders" className="mt-0 focus-visible:outline-none">
            <CustomerOrders orders={orders} />
          </TabsContent>

          <TabsContent value="addresses" className="mt-0 focus-visible:outline-none">
            <CustomerAddresses addresses={customer.addresses || []} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 focus-visible:outline-none">
            <CustomerReviews userId={user.id} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
            <UserForm initialData={user} onSubmit={onUpdate} isLoading={isUpdating} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
