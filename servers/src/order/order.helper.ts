import { BadRequestException } from '@nestjs/common';

export function maskEmail(email?: string) {
  if (!email || !email.includes('@')) return email;
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
}

export function maskPhone(phone?: string) {
  if (!phone || phone.length < 7) return phone;
  return `${phone.substring(0, 3)}****${phone.substring(phone.length - 3)}`;
}

export function serializeOrder(order: any, maskPII = false) {
  if (!order) return null;

  let serialized = { ...order };

  if (maskPII) {
    if (serialized.guestEmail) serialized.guestEmail = maskEmail(serialized.guestEmail);
    if (serialized.guestPhone) serialized.guestPhone = maskPhone(serialized.guestPhone);
    if (serialized.phone) serialized.phone = maskPhone(serialized.phone);
    if (serialized.user?.email) serialized.user.email = maskEmail(serialized.user.email);
    if (serialized.user?.phone) serialized.user.phone = maskPhone(serialized.user.phone);
    
    if (serialized.shippingSnapshot) {
      const snap = { ...serialized.shippingSnapshot };
      if (snap.phone) snap.phone = maskPhone(snap.phone);
      if (snap.email) snap.email = maskEmail(snap.email);
      serialized.shippingSnapshot = snap;
    }
  }

  if (serialized.payment) {
    serialized.payment = {
      ...serialized.payment,
      payosOrderCode: serialized.payment.payosOrderCode
        ? Number(serialized.payment.payosOrderCode)
        : null,
    };
  }

  serialized.isClaimed = !!serialized.userId;

  return serialized;
}

export async function generateOrderCode(
  checkExistsFn: (code: string) => Promise<any>,
): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  code = 'ORD-';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const existing = await checkExistsFn(code);

  if (existing) {
    return generateOrderCode(checkExistsFn);
  }

  return code;
}

export function calculateOrderTotal(
  items: Array<{ quantity: number; price: number }>,
  providedShippingFee?: number,
  discount?: {
    percentage?: number;
    fixedAmount?: number;
    maxDiscountAmount?: number;
  },
) {
  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  // Logic phí ship: Ưu tiên phí ship truyền vào (từ GHN), nếu không có thì mặc định 30k
  let shippingFee =
    providedShippingFee !== undefined ? Number(providedShippingFee) : 30000;

  const taxAmount = 0;

  let discountAmount = 0;
  if (discount) {
    if (discount.percentage) {
      discountAmount = Math.round((totalItems * discount.percentage) / 100);
    } else if (discount.fixedAmount) {
      discountAmount = discount.fixedAmount;
    }

    if (
      discount.maxDiscountAmount &&
      discountAmount > discount.maxDiscountAmount
    ) {
      discountAmount = discount.maxDiscountAmount;
    }

    discountAmount = Math.min(discountAmount, totalItems);
  }

  const total = totalItems + shippingFee;
  const discountedTotal = total - discountAmount;

  return {
    totalItems,
    shippingFee,
    taxAmount,
    discountAmount,
    total,
    discountedTotal,
  };
}

export function validateDiscount(
  discount: any,
  subtotal?: number,
  currentUsageCount?: number,
) {
  if (!discount) {
    throw new BadRequestException('Mã giảm giá không tồn tại');
  }

  if (!discount.isActive) {
    throw new BadRequestException('Mã giảm giá đã bị vô hiệu hóa');
  }

  const now = new Date();

  if (discount.startDate && discount.startDate > now) {
    throw new BadRequestException(
      `Mã giảm giá chưa có hiệu lực (từ ${new Date(discount.startDate).toLocaleDateString('vi-VN')})`,
    );
  }

  if (discount.endDate && discount.endDate < now) {
    throw new BadRequestException('Mã giảm giá đã hết hạn');
  }

  if (
    subtotal !== undefined &&
    discount.minOrderAmount &&
    subtotal < discount.minOrderAmount
  ) {
    throw new BadRequestException(
      `Đơn hàng tối thiểu ${discount.minOrderAmount.toLocaleString('vi-VN')}đ để sử dụng mã này`,
    );
  }

  if (
    discount.usageLimit &&
    currentUsageCount !== undefined &&
    currentUsageCount >= discount.usageLimit
  ) {
    throw new BadRequestException('Mã giảm giá đã đạt giới hạn số lần sử dụng');
  }

  return true;
}

export function prepareOrderData(
  orderCode: string,
  userId: number | null,
  dto: any,
  items: Array<{
    variantId: number;
    quantity: number;
    price: number;
    productName?: string;
  }>,
  totals: {
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    total: number;
  },
  discount: any,
) {
  const orderData: any = {
    orderCode,
    shippingSnapshot: {
      addressString:
        dto.shippingAddress ||
        (dto.shippingInfo
          ? `${dto.shippingInfo.street || ''}, ${dto.shippingInfo.ward || ''}, ${dto.shippingInfo.district || ''}, ${dto.shippingInfo.province || ''}`.replace(
              /^, /,
              '',
            )
          : null),
      ...(dto.shippingInfo || {}),
      // Đảm bảo có cả 2 cách gọi để tương thích ngược
      provinceCode:
        dto.shippingInfo?.provinceCode || dto.shippingInfo?.cityCode || null,
      districtCode: dto.shippingInfo?.districtCode || null,
      wardCode: dto.shippingInfo?.wardCode || null,
    },
    guestEmail: dto.guestEmail || null,
    guestPhone: dto.guestPhone || null,
    subtotal: totals.subtotal,
    shippingFee: totals.shippingFee,
    discountAmount: totals.discountAmount,
    total: totals.total,
    taxAmount: 0,
    paymentMethod: dto.paymentMethod || 'CASH',
    status: dto.status || 'PENDING',
    orderItems: {
      create: items.map((item: any) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,
        productName: item.productName || 'Sản phẩm',
      })),
    },
  };

  if (userId) {
    orderData.user = { connect: { id: userId } };
  }

  if (dto.addressId) {
    orderData.address = { connect: { id: dto.addressId } };
  }

  if (dto.shippingMethodId) {
    orderData.shippingMethod = { connect: { id: dto.shippingMethodId } };
  }

  if (discount) {
    orderData.discount = { connect: { id: discount.id } };
  }

  return orderData;
}

export function prepareOrderEmailDetails(order: any) {
  const customerEmail = order.guestEmail || order.user?.email;
  const shipping = order.shippingSnapshot as any;
  const customerName = shipping?.fullName || order.user?.name || 'Khách hàng';

  return {
    customerEmail,
    customerName,
    orderDetails: {
      customerName,
      items: order.orderItems.map((item) => ({
        productName: item.variant?.product?.name || item.productName || 'N/A',
        size: item.variant?.size,
        color: item.variant?.color,
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,
      })),
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingFee: order.shippingFee,
      total: order.total,
      paymentMethod: order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 
                     order.paymentMethod === 'VNPAY' ? 'Thanh toán qua VNPay' : 
                     order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' : order.paymentMethod,
      shippingAddress: shipping?.addressString || 'N/A',
      createdAt: order.createdAt,
    }
  };
}
