import { z } from "zod";

export const orderFormSchema = z.object({
  userId: z.number().optional(),
  guestEmail: z.string().optional(),
  guestPhone: z.string().optional(),
  shippingAddress: z.string(),
  paymentMethod: z.string(),
  status: z.string(),
  shippingFee: z.number(),
  discountCode: z.string().optional(),
  items: z
    .array(
      z.object({
        variantId: z.string(),
        quantity: z.number().min(1),
        productName: z.string(),
        price: z.number(),
        image: z.string().optional(),
        stock: z.number().optional(),
      })
    )
    .min(1, "Vui lòng chọn ít nhất 1 sản phẩm"),
});

export const guestOrderLookupSchema = z.object({
  orderCode: z.string().min(1, "Vui lòng nhập mã đơn hàng"),
  contact: z.string().min(1, "Vui lòng nhập số điện thoại hoặc email"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type GuestOrderLookupValues = z.infer<typeof guestOrderLookupSchema>;
