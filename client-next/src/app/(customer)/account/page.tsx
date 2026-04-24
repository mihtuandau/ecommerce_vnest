"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { User, MapPin, Lock, Star, Camera } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

export default function AccountPage() {
  const { user } = useAuthStore();
  const { success } = useToast();
  
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    success("Cập nhật thông tin thành công!");
  };

  if (!user) return null;

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Header Profile */}
        <div className="flex items-center gap-6 p-8 bg-primary/5 rounded-3xl border border-primary/10">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-xl border-4 border-background">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 bg-background border rounded-full flex items-center justify-center shadow-md hover:text-primary transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
            <TabsTrigger value="info" className="gap-2"><User className="h-4 w-4" /> Thông tin</TabsTrigger>
            <TabsTrigger value="address" className="gap-2"><MapPin className="h-4 w-4" /> Địa chỉ</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><Lock className="h-4 w-4" /> Bảo mật</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2"><Star className="h-4 w-4" /> Đánh giá</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Họ và tên</label>
                        <Input 
                          value={form.name} 
                          onChange={(e) => setForm({...form, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input value={form.email} disabled />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Số điện thoại</label>
                        <Input 
                          value={form.phone}
                          onChange={(e) => setForm({...form, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="rounded-full px-8">Lưu thay đổi</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-sm">Thống kê cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Đơn hàng đã đặt</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tổng chi tiêu</span>
                    <span className="font-bold text-primary">{formatCurrency(15400000)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="address">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sổ địa chỉ</CardTitle>
                <Button variant="outline" size="sm" className="rounded-full">+ Thêm địa chỉ mới</Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <MapPin className="h-12 w-12 opacity-10 mb-4" />
                  <p>Bạn chưa lưu địa chỉ nào.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="max-w-2xl border-none shadow-sm">
              <CardHeader>
                <CardTitle>Đổi mật khẩu</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mật khẩu hiện tại</label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mật khẩu mới</label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                    <Input type="password" />
                  </div>
                  <Button className="rounded-full px-8">Cập nhật mật khẩu</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
