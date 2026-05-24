"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Compass, HelpCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white border border-[#DDD6C8] rounded-xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#FAF8F4] flex items-center justify-center text-brand-bronze border border-brand-ivory">
              <Compass size={20} />
            </div>
            <div>
              <DialogTitle className="text-[18px] font-bold text-primary tracking-tight uppercase">
                Hướng dẫn chọn size
              </DialogTitle>
              <DialogDescription className="text-[12.5px] text-brand-taupe mt-0.5">
                Tìm kích cỡ tối ưu dựa trên số đo cơ thể của bạn
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="tops" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#FAF8F4] p-1 rounded-full border border-brand-ivory mb-6">
              <TabsTrigger
                value="tops"
                className="rounded-full text-[11.5px] font-bold py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Áo (T-Shirt/Shirt)
              </TabsTrigger>
              <TabsTrigger
                value="bottoms"
                className="rounded-full text-[11.5px] font-bold py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Quần (Jeans/Pants)
              </TabsTrigger>
              <TabsTrigger
                value="dresses"
                className="rounded-full text-[11.5px] font-bold py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Đầm & Váy (Dresses)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tops" className="space-y-4 outline-none">
              <div className="overflow-x-auto rounded-xl border border-brand-ivory">
                <table className="w-full border-collapse text-left text-[12px]">
                  <thead>
                    <tr className="bg-[#FAF8F4] text-primary font-bold uppercase tracking-wider border-b border-brand-ivory">
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Chiều cao (cm)</th>
                      <th className="p-3.5">Cân nặng (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-ivory text-brand-taupe font-medium">
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">S</td>
                      <td className="p-3.5">150 - 160</td>
                      <td className="p-3.5">45 - 53</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">M</td>
                      <td className="p-3.5">160 - 167</td>
                      <td className="p-3.5">54 - 60</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">L</td>
                      <td className="p-3.5">167 - 172</td>
                      <td className="p-3.5">61 - 68</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">XL</td>
                      <td className="p-3.5">172 - 178</td>
                      <td className="p-3.5">69 - 76</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">XXL</td>
                      <td className="p-3.5">178 - 185</td>
                      <td className="p-3.5">77 - 85</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="bottoms" className="space-y-4 outline-none">
              <div className="overflow-x-auto rounded-xl border border-brand-ivory">
                <table className="w-full border-collapse text-left text-[12px]">
                  <thead>
                    <tr className="bg-[#FAF8F4] text-primary font-bold uppercase tracking-wider border-b border-brand-ivory">
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Chiều cao (cm)</th>
                      <th className="p-3.5">Cân nặng (kg)</th>
                      <th className="p-3.5">Vòng eo (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-ivory text-brand-taupe font-medium">
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">28 / S</td>
                      <td className="p-3.5">155 - 160</td>
                      <td className="p-3.5">50 - 55</td>
                      <td className="p-3.5">72 - 74</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">29 / M</td>
                      <td className="p-3.5">160 - 165</td>
                      <td className="p-3.5">55 - 60</td>
                      <td className="p-3.5">74 - 77</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">30 / M</td>
                      <td className="p-3.5">165 - 170</td>
                      <td className="p-3.5">60 - 65</td>
                      <td className="p-3.5">77 - 80</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">31 / L</td>
                      <td className="p-3.5">170 - 175</td>
                      <td className="p-3.5">65 - 70</td>
                      <td className="p-3.5">80 - 83</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">32 / L</td>
                      <td className="p-3.5">175 - 180</td>
                      <td className="p-3.5">70 - 75</td>
                      <td className="p-3.5">83 - 86</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">33 / XL</td>
                      <td className="p-3.5">180 - 185</td>
                      <td className="p-3.5">75 - 80</td>
                      <td className="p-3.5">86 - 89</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="dresses" className="space-y-4 outline-none">
              <div className="overflow-x-auto rounded-xl border border-brand-ivory">
                <table className="w-full border-collapse text-left text-[12px]">
                  <thead>
                    <tr className="bg-[#FAF8F4] text-primary font-bold uppercase tracking-wider border-b border-brand-ivory">
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Chiều cao (cm)</th>
                      <th className="p-3.5">Cân nặng (kg)</th>
                      <th className="p-3.5">Vòng eo (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-ivory text-brand-taupe font-medium">
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">S</td>
                      <td className="p-3.5">150 - 155</td>
                      <td className="p-3.5">45 - 52</td>
                      <td className="p-3.5">62 - 66</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">M</td>
                      <td className="p-3.5">155 - 160</td>
                      <td className="p-3.5">53 - 58</td>
                      <td className="p-3.5">66 - 70</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">L</td>
                      <td className="p-3.5">160 - 165</td>
                      <td className="p-3.5">59 - 64</td>
                      <td className="p-3.5">70 - 74</td>
                    </tr>
                    <tr className="hover:bg-[#FAF8F4]/30 transition-colors">
                      <td className="p-3.5 font-bold text-primary">XL</td>
                      <td className="p-3.5">165 - 170</td>
                      <td className="p-3.5">65 - 72</td>
                      <td className="p-3.5">74 - 78</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 bg-[#FAF8F4] border border-brand-ivory rounded-xl p-4 flex gap-3">
          <HelpCircle size={18} className="text-brand-bronze shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[12px] font-bold text-primary uppercase tracking-wider">
              Lưu ý hữu ích
            </h4>
            <p className="text-[11.5px] text-brand-taupe font-medium leading-relaxed">
              Nếu số đo của bạn nằm giữa hai kích cỡ, hãy chọn kích cỡ{" "}
              <strong>lớn hơn</strong> để có cảm giác thoải mái nhất khi di chuyển, hoặc{" "}
              <strong>nhỏ hơn</strong> nếu bạn yêu thích phong cách mặc vừa vặn, ôm dáng
              (Slim fit).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
