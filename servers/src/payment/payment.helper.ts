
export const serializePayment = (payment: any) => {
  if (!payment) return null;
  let guestNameFromSnapshot = 'Khách vãng lai';
  if (payment.order?.shippingSnapshot && typeof payment.order.shippingSnapshot === 'object') {
    guestNameFromSnapshot = (payment.order.shippingSnapshot as any).fullName || 'Khách vãng lai';
  }

  return {
    ...payment,
    amount: payment.amount || payment.order?.total || 0,
    order: payment.order ? {
      ...payment.order,
      customerName: payment.order.user?.name || guestNameFromSnapshot,
      customerEmail: payment.order.user?.email || payment.order.guestEmail || 'N/A',
      customerPhone: payment.order.user?.phone || payment.order.guestPhone || 'N/A',
    } : undefined,
  };
};

export const generateTransactionId = (method: string): string => {
  const prefix = method.toUpperCase().substring(0, 3);
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};
