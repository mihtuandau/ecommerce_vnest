"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";
import { shippingApi } from "@/features/shipping/api";
import { ordersApi } from "@/features/orders/api";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { CreditCard, Truck, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { success, error } = useToast();
  const router = useRouter();

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [shippingFee, setShippingFee] = useState(0);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    provinceId: "",
    districtId: "",
    wardCode: "",
    street: "",
    paymentMethod: "COD",
  });

  useEffect(() => {
    shippingApi.getProvinces().then((res) => setProvinces(res.data || []));
  }, []);

  const handleProvinceChange = async (id: string) => {
    setForm({ ...form, provinceId: id, districtId: "", wardCode: "" });
    const res = await shippingApi.getDistricts(Number(id));
    setDistricts(res.data || []);
    setWards([]);
  };

  const handleDistrictChange = async (id: string) => {
    setForm({ ...form, districtId: id, wardCode: "" });
    const res = await shippingApi.getWards(Number(id));
    setWards(res.data || []);
  };

  const handleWardChange = async (code: string) => {
    setForm({ ...form, wardCode: code });
    // Calculate shipping fee
    const res = await shippingApi.calculateFee({
      to_district_id: Number(form.districtId),
      to_ward_code: code,
      weight: 1000, // Default weight
    });
    setShippingFee(res.data?.total || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          province: provinces.find(p => p.ProvinceID === Number(form.provinceId))?.ProvinceName,
          district: districts.find(d => d.DistrictID === Number(form.districtId))?.DistrictName,
          ward: wards.find(w => w.WardCode === form.wardCode)?.WardName,
          street: form.street,
        },
        paymentMethod: form.paymentMethod,
        shippingFee,
      };

      // In a real app, use a mutation hook
      // const res = await ordersApi.createOrder(orderData);
      
      success("Đặt hàng thành công!");
      clearCart();
      router.push(ROUTES.ORDERS);
    } catch (err: any) {
      error(err?.response?.data?.message || "Có lỗi xảy ra khi đặt hàng");
    }
  };

  if (items.length === 0) {
    router.push(ROUTES.CART);
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Forms */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Họ và tên</label>
                <Input 
                  required 
                  placeholder="Nguyễn Văn A" 
                  value={form.fullName}
                  onChange={(e) => setForm({...form, fullName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Số điện thoại</label>
                <Input 
                  required 
                  placeholder="0987xxxxxx" 
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tỉnh / Thành phố</label>
                <Select value={form.provinceId} onValueChange={handleProvinceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Tỉnh/Thành" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.ProvinceID} value={p.ProvinceID.toString()}>
                        {p.ProvinceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quận / Huyện</label>
                <Select 
                  value={form.districtId} 
                  onValueChange={handleDistrictChange}
                  disabled={!form.provinceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Quận/Huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.DistrictID} value={d.DistrictID.toString()}>
                        {d.DistrictName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phường / Xã</label>
                <Select 
                  value={form.wardCode} 
                  onValueChange={handleWardChange}
                  disabled={!form.districtId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Phường/Xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((w) => (
                      <SelectItem key={w.WardCode} value={w.WardCode}>
                        {w.WardName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Địa chỉ cụ thể (Số nhà, tên đường...)</label>
                <Input 
                  required 
                  placeholder="Ví dụ: 123 Đường ABC" 
                  value={form.street}
                  onChange={(e) => setForm({...form, street: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "COD", name: "Thanh toán khi nhận hàng", desc: "Trả tiền mặt cho shipper" },
                  { id: "VNPAY", name: "Thanh toán qua VNPay", desc: "Ví điện tử hoặc ngân hàng" },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: method.id })}
                    className={`flex flex-col p-4 border rounded-xl text-left transition-all ${
                      form.paymentMethod === method.id 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "hover:border-primary/50"
                    }`}
                  >
                    <span className="font-bold">{method.name}</span>
                    <span className="text-xs text-muted-foreground">{method.desc}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" /> Tóm tắt đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="line-clamp-1 flex-1 pr-4">{item.quantity}x {item.name}</span>
                    <span className="font-medium shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-border my-4" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-medium">{formatCurrency(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className={shippingFee === 0 ? "text-muted-foreground italic" : "font-medium"}>
                  {shippingFee > 0 ? formatCurrency(shippingFee) : "Chưa tính"}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-black text-primary">
                  {formatCurrency(totalPrice() + shippingFee)}
                </span>
              </div>
              <Button type="submit" className="w-full h-14 rounded-full text-lg mt-4 shadow-lg shadow-primary/20">
                Xác nhận đặt hàng
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
