import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SystemSettingsService } from '../system-settings/system-settings.service';

@Injectable()
export class ChatbotContextService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SystemSettingsService,
  ) {}

  private mapOrderStatus(status: string): string {
    const statusMap: Record<string, string> = {
      PENDING: 'đang chờ xác nhận',
      PROCESSING: 'đang chuẩn bị hàng',
      SHIPPED: 'đang giao hàng',
      DELIVERED: 'đã giao thành công',
      CANCELLED: 'đã hủy',
      RETURN_REQUESTED: 'đang yêu cầu trả hàng',
    };
    return statusMap[status] || status.toLowerCase();
  }

  private isPromotionQuestion(message?: string) {
    const text = (message || '').toLowerCase();
    return /(mã|ma|voucher|coupon|khuyến mãi|khuyen mai|giảm giá|giam gia|ưu đãi|uu dai|flash sale|sale|deal)/i.test(
      text,
    );
  }

  async getStoreContext(userId?: number, message?: string) {
    try {
      const now = new Date();
      const includePromotions = this.isPromotionQuestion(message);
      const [settings, policies, products, categories, discounts, userOrders] =
        await Promise.all([
          this.settingsService.getSettings(),
          this.prisma.policyPage.findMany({
            where: { isActive: true },
            take: 5,
            orderBy: { updatedAt: 'desc' },
            select: { type: true, title: true, content: true },
          }),
          this.prisma.product.findMany({
            where: { isActive: true, deletedAt: null },
            take: 20,
            select: {
              id: true,
              name: true,
              description: true,
              basePrice: true,
              originalPrice: true,
              averageRating: true,
              reviewCount: true,
              soldCount: true,
              brand: { select: { name: true } },
              category: {
                select: {
                  name: true,
                  parent: { select: { name: true } },
                },
              },
              images: {
                orderBy: [{ isThumbnail: 'desc' }, { displayOrder: 'asc' }],
                take: 1,
                select: { url: true },
              },
              variants: {
                where: { isActive: true },
                take: 8,
                select: {
                  id: true,
                  size: true,
                  color: true,
                  stock: true,
                  price: true,
                  originalPrice: true,
                  sku: true,
                },
                orderBy: [{ size: 'asc' }, { color: 'asc' }],
              },
              reviews: {
                orderBy: { createdAt: 'desc' },
                take: 3,
                select: {
                  rating: true,
                  comment: true,
                  verified: true,
                },
              },
            },
            orderBy: { soldCount: 'desc' },
          }),
          this.prisma.category.findMany({
            select: {
              name: true,
              parent: { select: { name: true } },
            },
            take: 15,
            orderBy: { name: 'asc' },
          }),
          this.prisma.discount.findMany({
            where: {
              isActive: true,
              startDate: { lte: now },
              OR: [{ endDate: null }, { endDate: { gte: now } }],
            },
            include: {
              applicableToProducts: {
                include: { product: { select: { id: true } } },
              },
            },
          }),
          userId
            ? this.prisma.order.findMany({
                where: { userId, deletedAt: null },
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: {
                  id: true,
                  orderCode: true,
                  status: true,
                  total: true,
                  subtotal: true,
                  shippingFee: true,
                  discountAmount: true,
                  paymentMethod: true,
                  shippingCode: true,
                  statusHistory: true,
                  returnStatus: true,
                  refundedAmount: true,
                  createdAt: true,
                  payment: {
                    select: {
                      method: true,
                      status: true,
                      amount: true,
                    },
                  },
                  shippingMethod: {
                    select: {
                      name: true,
                      estimatedDays: true,
                      price: true,
                    },
                  },
                  returnRequests: {
                    take: 2,
                    orderBy: { createdAt: 'desc' },
                    select: {
                      status: true,
                      reason: true,
                      refundAmount: true,
                    },
                  },
                  orderItems: {
                    take: 5,
                    select: {
                      productName: true,
                      quantity: true,
                      price: true,
                      originalPrice: true,
                      variantSnapshot: true,
                      variant: {
                        select: {
                          size: true,
                          color: true,
                          product: {
                            select: {
                              id: true,
                              name: true,
                              slug: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              })
            : Promise.resolve([]),
        ]);

      const storeInfo = [
        `Trạng thái khách: ${userId ? 'đã đăng nhập' : 'khách vãng lai/chưa đăng nhập'}`,
        `Tên cửa hàng: ${settings.storeName}`,
        `Email: ${settings.storeEmail}`,
        `Hotline: ${settings.storePhone}`,
        `Địa chỉ: ${settings.storeAddress}`,
        `Phí vận chuyển mặc định: ${settings.shippingFee.toLocaleString('vi-VN')}đ`,
        `Miễn phí vận chuyển từ: ${settings.freeShippingThreshold.toLocaleString('vi-VN')}đ`,
        `Thời hạn đổi/trả: ${settings.returnWindowDays} ngày`,
        `Thanh toán: COD ${settings.codEnabled ? 'đang bật' : 'đang tắt'}, VNPay ${
          settings.vnpayEnabled ? 'đang bật' : 'đang tắt'
        }`,
      ].join('\n');

      const policyInfo = policies
        .map((p) => {
          const content = p.content.replace(/\s+/g, ' ').slice(0, 420);
          return `- ${p.title} (${p.type}): ${content}`;
        })
        .join('\n');

      const flashSaleMap = new Map<number, any>();
      discounts
        .filter((d) => d.isFlashSale)
        .forEach((d) => {
          d.applicableToProducts.forEach((ap) => {
            if (ap.product) flashSaleMap.set(ap.product.id, d);
          });
        });

      const productInfo = products
        .map((p) => {
          const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
          const flashSale = flashSaleMap.get(p.id);
          let priceText = `${p.basePrice.toLocaleString('vi-VN')}đ`;

          if (flashSale) {
            const discountVal = flashSale.percentage
              ? (p.basePrice * flashSale.percentage) / 100
              : flashSale.fixedAmount || 0;
            const finalPrice = Math.max(0, p.basePrice - discountVal);
            priceText = `${p.basePrice.toLocaleString('vi-VN')}đ (GIẢM CÒN: ${finalPrice.toLocaleString('vi-VN')}đ)`;
          }

          const categoryPath = [p.category?.parent?.name, p.category?.name]
            .filter(Boolean)
            .join(' > ');
          const variants = p.variants
            .map((v) => {
              const label = [
                v.size && `size ${v.size}`,
                v.color && `màu ${v.color}`,
              ]
                .filter(Boolean)
                .join(', ');
              const variantPrice =
                v.price && v.price !== p.basePrice
                  ? `, giá ${v.price.toLocaleString('vi-VN')}đ`
                  : '';
              return `variant ${v.id} - ${label || v.sku || 'phiên bản'}: tồn ${v.stock}${variantPrice}`;
            })
            .join('; ');
          const reviews = p.reviews
            .filter((r) => r.comment)
            .map(
              (r) =>
                `${r.rating} sao${r.verified ? ', đã xác minh' : ''}: ${r.comment}`,
            )
            .join(' | ');
          const desc = p.description
            ? p.description.replace(/\s+/g, ' ').slice(0, 220)
            : '';

          return [
            `- ${p.name} (id:${p.id})`,
            `  brand: ${p.brand?.name || 'không rõ'}, loại: ${categoryPath || 'không rõ'}`,
            `  giá: ${priceText}, rating: ${(p.averageRating || 0).toFixed(1)}/${p.reviewCount || 0} review, đã bán: ${p.soldCount || 0}, tồn: ${totalStock}${totalStock <= 0 ? ' [hết hàng]' : ''}`,
            p.images[0]?.url ? `  ảnh: ${p.images[0].url}` : '',
            desc ? `  mô tả: ${desc}` : '',
            variants ? `  phân loại: ${variants}` : '',
            reviews ? `  review gần đây: ${reviews}` : '',
          ]
            .filter(Boolean)
            .join('\n');
        })
        .join('\n');

      const categoryInfo = categories
        .map((c) => [c.parent?.name, c.name].filter(Boolean).join(' > '))
        .join(', ');

      const flashSales = discounts.filter((d) => d.isFlashSale);
      const vouchers = discounts.filter((d) => !d.isFlashSale);

      const flashInfo = flashSales
        .map((d) => {
          const ids = d.applicableToProducts
            .map((ap) => ap.product?.id)
            .filter(Boolean)
            .join(', ');
          return `- [FLASH SALE] ${d.description}: Giảm ${d.percentage ? d.percentage + '%' : d.fixedAmount} cho ids: ${ids}.`;
        })
        .join('\n');

      const voucherInfo = vouchers
        .map(
          (d) =>
            `- [VOUCHER] Mã: ${d.code}: Giảm ${d.percentage ? d.percentage + '%' : d.fixedAmount}.`,
        )
        .join('\n');

      let orderInfo = '';
      if (userOrders.length > 0) {
        orderInfo =
          `\nĐƠN HÀNG CỦA KHÁCH ĐÃ ĐĂNG NHẬP (không hiển thị cho khách vãng lai):\n` +
          userOrders
            .map((o) => {
              const items = o.orderItems
                .map((item) => {
                  const snapshot = item.variantSnapshot;
                  const size = item.variant?.size || snapshot?.size;
                  const color = item.variant?.color || snapshot?.color;
                  const variantText = [
                    size && `size ${size}`,
                    color && `màu ${color}`,
                  ]
                    .filter(Boolean)
                    .join(', ');
                  return `${item.productName}${variantText ? ` (${variantText})` : ''} x${item.quantity}`;
                })
                .join('; ');
              const returns = o.returnRequests
                .map((r) => `${r.status}: ${r.reason}`)
                .join('; ');
              const paymentStatus = o.payment?.status || 'chưa rõ';
              const shipping = [
                o.shippingMethod?.name,
                o.shippingCode && `mã vận chuyển ${o.shippingCode}`,
              ]
                .filter(Boolean)
                .join(', ');

              return [
                `- Đơn ${o.orderCode}: ${this.mapOrderStatus(o.status)}, thanh toán ${paymentStatus}, tổng ${o.total.toLocaleString('vi-VN')}đ`,
                `  sản phẩm: ${items || 'không có dữ liệu'}`,
                shipping
                  ? `  giao hàng: ${shipping}, phí ship ${o.shippingFee.toLocaleString('vi-VN')}đ`
                  : '',
                o.returnStatus ? `  trả/hoàn: ${o.returnStatus}` : '',
                returns ? `  yêu cầu trả hàng: ${returns}` : '',
              ]
                .filter(Boolean)
                .join('\n');
            })
            .join('\n');
      }

      const sizeGuide = [
        'Áo: S 150-160cm/45-53kg; M 160-167cm/54-60kg; L 167-172cm/61-68kg; XL 172-178cm/69-76kg; XXL 178-185cm/77-85kg.',
        'Quần: 28/S 155-160cm/50-55kg; 29/M 160-165cm/55-60kg; 30/M 165-170cm/60-65kg; 31/L 170-175cm/65-70kg; 32/L 175-180cm/70-75kg; 33/XL 180-185cm/75-80kg.',
        'Đầm/Váy: S 150-155cm/45-52kg; M 155-160cm/53-58kg; L 160-165cm/59-64kg; XL 165-170cm/65-72kg.',
      ].join('\n');

      const promotionInfo = includePromotions
        ? `FLASH SALE:\n${flashInfo || '- Không có.'}\n\nVOUCHER:\n${voucherInfo || '- Không có.'}`
        : `FLASH SALE:\n${flashInfo || '- Không có.'}\n\nVOUCHER: chỉ cung cấp khi khách hỏi về mã giảm giá/ưu đãi.`;

      return `THÔNG TIN CỬA HÀNG:\n${storeInfo}\n\nCHÍNH SÁCH/FAQ:\n${policyInfo || '- Chưa có dữ liệu chính sách.'}\n\n${promotionInfo}\n\nDANH MỤC:\n${categoryInfo || '- Không có.'}\n\nBẢNG SIZE THAM KHẢO:\n${sizeGuide}\n\nSẢN PHẨM:\n${productInfo}${orderInfo || '\n\nKhách vãng lai/chưa đăng nhập: không có dữ liệu đơn hàng cá nhân. Nếu hỏi đơn hàng, hãy yêu cầu đăng nhập hoặc tra cứu đơn.'}`;
    } catch (error) {
      return '';
    }
  }
}
