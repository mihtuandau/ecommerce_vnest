"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ShoppingBag, MapPin, Star, UserCog } from "lucide-react";
import { CustomerOrders } from "./CustomerOrders";
import { CustomerAddresses } from "./CustomerAddresses";
import { CustomerReviews } from "./CustomerReviews";
import { UserForm } from "@/features/users/components/admin/create/UserForm";
import { User, Order, Address } from "@/types/models";

interface CustomerTabsProps {
  user: User;
  activeTab: string;
  onTabChange: (value: string) => void;
  onUpdate: (data: Partial<User>) => void;
  isUpdating: boolean;
}

const tabClass =
  "gap-2 rounded-lg px-6 py-2 text-sm font-medium text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-teal-800 data-[state=active]:shadow-sm";

export function CustomerTabs({
  user,
  activeTab,
  onTabChange,
  onUpdate,
  isUpdating,
}: CustomerTabsProps) {
  const customer = user as User & { orders?: Order[]; addresses?: Address[] };
  const orders = customer.orders || [];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="border-b border-slate-100 px-6 py-4">
          <TabsList className="h-auto gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
            <TabsTrigger value="orders" className={tabClass}>
              <ShoppingBag className="h-3.5 w-3.5" />
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger value="addresses" className={tabClass}>
              <MapPin className="h-3.5 w-3.5" />
              Địa chỉ
            </TabsTrigger>
            <TabsTrigger value="reviews" className={tabClass}>
              <Star className="h-3.5 w-3.5" />
              Đánh giá
            </TabsTrigger>
            <TabsTrigger value="settings" className={tabClass}>
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
            <CustomerReviews userId={Number(user.id)} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
            <UserForm initialData={user} onSubmit={onUpdate} isLoading={isUpdating} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
