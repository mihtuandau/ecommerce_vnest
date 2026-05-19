"use client";

import React from "react";
import dayjs from "@/lib/dayjs";
import { formatCurrency } from "@/utils/formatCurrency";
import { PaymentMethod, PaymentStatus } from "@/types/enums";

interface PrintInvoiceProps {
  order: any;
}

export function PrintInvoice({ order }: PrintInvoiceProps) {
  const orderAny = order as any;
  const items = orderAny.orderItems || orderAny.items || [];

  const subtotal = orderAny.subtotal || 0;
  const shippingFee = orderAny.shippingFee || 0;
  const discountAmount = orderAny.discountAmount || 0;
  const total = orderAny.total || 0;

  return (
    <div
      id="print-area"
      className="hidden print:block print:p-8 !bg-white text-black font-sans leading-normal"
    >
      {/* Header Hóa Đơn */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8 !bg-transparent">
        <div className="!bg-transparent">
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-1">
            LUXE SHOP
          </h1>
          <p className="text-[10px] font-medium leading-relaxed">
            Địa chỉ: 109/47 Đường số 8 Khu Phố 11, Phường Linh Xuân, Thành phố Thủ Đức,
            TP.HCM
            <br />
            Hotline: 1900 8888
            <br />
            Website: luxe.vn
          </p>
        </div>
        <div className="text-right !bg-transparent">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Hóa đơn bán hàng
          </h2>
          <p className="text-xs font-bold mt-1">Số đơn: #{order.orderCode}</p>
          <p className="text-[10px] text-black italic mt-1">
            Ngày in: {dayjs().format("HH:mm, DD/MM/YYYY")}
          </p>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="grid grid-cols-2 gap-8 mb-10 !bg-transparent">
        <div className="!bg-transparent">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
            Thông tin khách hàng
          </h3>
          <p className="text-sm font-bold">
            {order.snapshot?.fullName ||
              order.shippingSnapshot?.fullName ||
              order.guestEmail ||
              order.user?.fullName ||
              "Khách hàng lẻ"}
          </p>
          <p className="text-xs mt-1">
            SĐT:{" "}
            {order.snapshot?.phone ||
              order.shippingSnapshot?.phone ||
              order.guestPhone ||
              order.user?.phone ||
              "N/A"}
          </p>
          <p className="text-xs mt-1 leading-relaxed max-w-[250px]">
            Địa chỉ:{" "}
            {order.shippingSnapshot?.addressString ||
              (order.shippingSnapshot
                ? [
                    order.shippingSnapshot.street,
                    order.shippingSnapshot.ward,
                    order.shippingSnapshot.district,
                    order.shippingSnapshot.province,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : null) ||
              "Mua tại quầy"}
          </p>
        </div>
        <div className="text-right !bg-transparent">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
            Thông tin đơn hàng
          </h3>
          <p className="text-xs font-medium">
            Ngày đặt: {dayjs(order.createdAt).format("DD/MM/YYYY")}
          </p>
          <p className="text-xs mt-1 font-medium">
            Thanh toán:{" "}
            <span className="font-bold">
              {order.paymentMethod === PaymentMethod.CASH ? "Tiền mặt" : order.paymentMethod}
            </span>
          </p>
          <p className="text-xs mt-1 uppercase font-black">
            Trạng thái:{" "}
            {order.payment?.status === PaymentStatus.SUCCESS ? "Đã thanh toán" : "Chờ thanh toán"}
          </p>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <table className="w-full mb-10 border-collapse !bg-transparent">
        <thead>
          <tr className="border-y-2 border-black !bg-transparent">
            <th className="py-3 text-left text-[10px] font-black uppercase tracking-widest !bg-transparent">
              STT
            </th>
            <th className="py-3 text-left text-[10px] font-black uppercase tracking-widest !bg-transparent">
              Sản phẩm
            </th>
            <th className="py-3 text-center text-[10px] font-black uppercase tracking-widest !bg-transparent">
              SL
            </th>
            <th className="py-3 text-right text-[10px] font-black uppercase tracking-widest !bg-transparent">
              Đơn giá
            </th>
            <th className="py-3 text-right text-[10px] font-black uppercase tracking-widest !bg-transparent">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10 !bg-transparent">
          {items.map((item: any, index: number) => (
            <tr key={index} className="!bg-transparent">
              <td className="py-4 text-xs font-bold !bg-transparent">{index + 1}</td>
              <td className="py-4 !bg-transparent">
                <p className="text-xs font-bold leading-snug">
                  {item.productName || "Sản phẩm"}
                </p>
                <div className="flex gap-2 mt-1 !bg-transparent">
                  {item.variant?.size && (
                    <span className="text-[9px] font-bold">
                      Size: {item.variant.size}
                    </span>
                  )}
                  {item.variant?.color && (
                    <span className="text-[9px] font-bold">
                      Màu: {item.variant.color}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 text-center text-xs font-bold !bg-transparent">
                {item.quantity}
              </td>
              <td className="py-4 text-right text-xs font-bold !bg-transparent">
                {formatCurrency(item.price)}
              </td>
              <td className="py-4 text-right text-xs font-bold !bg-transparent">
                {formatCurrency(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tổng cộng */}
      <div className="flex justify-end !bg-transparent">
        <div className="w-64 space-y-2 !bg-transparent">
          <div className="flex justify-between text-xs !bg-transparent">
            <span className="font-bold uppercase tracking-tighter">Tạm tính:</span>
            <span className="font-bold">{formatCurrency(subtotal)}</span>
          </div>
          {shippingFee > 0 && (
            <div className="flex justify-between text-xs !bg-transparent">
              <span className="font-bold uppercase tracking-tighter">
                Phí vận chuyển:
              </span>
              <span className="font-bold">+{formatCurrency(shippingFee)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-xs !bg-transparent">
              <span className="font-bold uppercase tracking-tighter">Giảm giá:</span>
              <span className="font-bold">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="pt-4 border-t-2 border-black flex justify-between items-end !bg-transparent">
            <span className="text-sm font-black uppercase tracking-widest">
              Tổng tiền:
            </span>
            <span className="text-xl font-black tracking-tighter">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 grid grid-cols-2 text-center !bg-transparent">
        <div className="!bg-transparent">
          <p className="text-xs font-bold uppercase mb-16">Người mua hàng</p>
          <p className="text-[10px] italic">(Ký và ghi rõ họ tên)</p>
        </div>
        <div className="!bg-transparent">
          <p className="text-xs font-bold uppercase mb-16">Người lập phiếu</p>
          <p className="text-[10px] italic">(Ký và ghi rõ họ tên)</p>
        </div>
      </div>

      <div className="mt-24 text-center border-t border-black/10 pt-8 !bg-transparent">
        <p className="text-sm font-black italic tracking-tight">
          Cảm ơn quý khách đã mua sắm tại LUXE!
        </p>
        <p className="text-[9px] mt-2 italic">
          Hóa đơn có giá trị trong ngày. Vui lòng kiểm tra kỹ hàng trước khi thanh toán.
        </p>
      </div>
    </div>
  );
}
