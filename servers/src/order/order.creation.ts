import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderCache } from './order.cache';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as OrderHelper from './order.helper';
import { PrismaService } from '../prisma/prisma.service';
import { GHNService } from '../ghn/ghn.service';
import { ConfigService } from '@nestjs/config';
import { SystemSettingsService } from '../system-settings/system-settings.service';

@Injectable()
export class OrderCreation {
  private readonly logger = new Logger(OrderCreation.name);

  constructor(
    private repository: OrderRepository,
    private cacheService: OrderCache,
    private cartService: CartService,
    private paymentService: PaymentService,
    private mailService: MailService,
    private prisma: PrismaService,
    private ghnService: GHNService,
    private configService: ConfigService,
    private systemSettingsService: SystemSettingsService,
  ) {}

  async create(userId: number | null, dto: CreateOrderDto, requester: { role: string }, ipAddr: string = '127.0.0.1'): Promise<any> {
    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(requester.role);
    const itemsToOrder = await this.getItemsToOrder(userId, dto, isStaff);
    const variantIds = itemsToOrder.map((i) => i.variantId);

    // 1. Luôn tính Flash Sale (auto-apply) để có dữ liệu so sánh với voucher.
    const { priceMap, discountId: autoDiscountId } = await this.repository.findAutoApplyPricesForVariants(variantIds);

    // 2. Chuẩn bị danh sách items với giá đã giảm (nếu có)
    const itemsWithDiscounts = itemsToOrder.map((item) => {
      const discountedPrice = priceMap.get(item.variantId);
      return {
        ...item,
        price:
          discountedPrice !== undefined && discountedPrice < item.price
            ? discountedPrice
            : item.price,
      };
    });

    const originalSubtotal = itemsToOrder.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const autoApplySubtotal = itemsWithDiscounts.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const autoApplySaving = originalSubtotal - autoApplySubtotal;

    const manualDiscount = await this.validateDiscount(
      dto.discountCode,
      originalSubtotal,
      userId,
      dto.guestEmail,
      dto.shippingInfo?.phone || dto.guestPhone
    );
    let manualCodeSaving = 0;
    if (manualDiscount) {
      if (manualDiscount.percentage) {
        manualCodeSaving = Math.round(
          (originalSubtotal * manualDiscount.percentage) / 100,
        );
      } else if (manualDiscount.fixedAmount) {
        manualCodeSaving = manualDiscount.fixedAmount;
      }
      if (
        manualDiscount.maxDiscountAmount &&
        manualCodeSaving > manualDiscount.maxDiscountAmount
      ) {
        manualCodeSaving = manualDiscount.maxDiscountAmount;
      }
      manualCodeSaving = Math.min(manualCodeSaving, originalSubtotal);
    }

    // 4. Quyết định dùng Flash Sale hay Voucher (cái nào lợi hơn cho khách)
    // Dùng strict > để ưu tiên voucher khi savings bằng nhau (vì khách chủ động nhập code)
    const useAutoApply =
      autoApplySaving > 0 && autoApplySaving > manualCodeSaving;
    
    // Tìm đối tượng discount cuối cùng để connect với Order
    let finalDiscount: any = null;
    let discountNote: string | null = null;
    if (useAutoApply && autoDiscountId) {
      finalDiscount = await this.prisma.discount.findUnique({ where: { id: autoDiscountId } });
      if (manualDiscount && dto.discountCode) {
        discountNote = `Flash Sale mang lại giảm giá ${autoApplySaving.toLocaleString('vi-VN')}đ, cao hơn voucher "${dto.discountCode}" (${manualCodeSaving.toLocaleString('vi-VN')}đ). Hệ thống đã tự động áp dụng mức giá tốt nhất cho bạn.`;
        this.logger.log(`[OrderCreation] Flash Sale (${autoApplySaving}) > Voucher "${dto.discountCode}" (${manualCodeSaving}). Auto-applied Flash Sale.`);
      }
    } else if (!useAutoApply && manualDiscount) {
      finalDiscount = manualDiscount;
    }

    const finalItems = useAutoApply ? itemsWithDiscounts : itemsToOrder;

    const discountData = finalDiscount
      ? {
          percentage: finalDiscount.percentage || undefined,
          fixedAmount: finalDiscount.fixedAmount || undefined,
          maxDiscountAmount: finalDiscount.maxDiscountAmount || undefined,
        }
      : {
          fixedAmount: 0,
        };

    // 5. Tính phí vận chuyển qua GHN
    // Mặc định phí ship là 30k, trừ khi là đơn POS thì mặc định là 0
    const isPOS = dto.status === 'DELIVERED' || dto.shippingAddress === 'Mua tại quầy';
    let ghnShippingFee = isPOS ? 0 : 30000;
    
    // Chỉ chấp nhận phí ship từ DTO nếu đó là Admin tạo đơn
    if (dto.shippingFee !== undefined && isStaff) {
      ghnShippingFee = dto.shippingFee;
    }

    try {
      const shippingFeeResult = await this.calculateGHNFee(dto, finalItems);
      if (shippingFeeResult) {
        ghnShippingFee = shippingFeeResult;
      } else {
        // GHN calculation failed
        const isOnlinePayment = ['VNPAY', 'PAYOS'].includes(dto.paymentMethod || '');
        if (isOnlinePayment && !isPOS) {
          throw new BadRequestException('Không thể tính phí vận chuyển. Vui lòng kiểm tra lại địa chỉ giao hàng.');
        }
        if (!isPOS && ghnShippingFee < 20000) {
          ghnShippingFee = 30000; 
        }
      }
    } catch (error) {
      const isOnlinePayment = ['VNPAY', 'PAYOS'].includes(dto.paymentMethod || '');
      if (isOnlinePayment && !isPOS) {
        throw new BadRequestException('Không thể tính phí vận chuyển qua GHN. Vui lòng thử lại.');
      }
      
      // Nếu GHN lỗi, dùng giá mặc định an toàn cho COD
      if (!isPOS && ghnShippingFee < 20000) {
        ghnShippingFee = 30000;
      }
      
      if (!isPOS) {
        this.logger.warn('GHN fee calculation failed, using fallback:', error.message);
      }
    }

    const totals = OrderHelper.calculateOrderTotal(
      finalItems,
      ghnShippingFee,
      finalDiscount ? discountData : undefined,
    );

    // Áp dụng chính sách miễn phí vận chuyển từ cấu hình hệ thống
    const systemSettings = await this.systemSettingsService.getSettings();
    if (totals.totalItems >= systemSettings.freeShippingThreshold) {
      totals.shippingFee = 0;
      // Recalculate total & discountedTotal nhất quán với formula gốc:
      // total = totalItems + shippingFee (= totalItems + 0)
      // discountedTotal = total - discountAmount
      totals.total = totals.totalItems; // shippingFee = 0 nên total = totalItems
      totals.discountedTotal = Math.max(0, totals.total - totals.discountAmount);
    }

    const orderCode = await OrderHelper.generateOrderCode((code) =>
      this.repository.findByCode(code),
    );

    const orderData = OrderHelper.prepareOrderData(
      orderCode,
      userId,
      dto,
      finalItems,
      {
        subtotal: totals.totalItems,
        shippingFee: totals.shippingFee,
        discountAmount: totals.discountAmount,
        total: totals.discountedTotal,
      },
      finalDiscount,
    );

    const order = (await this.repository.createOrderTransactional(
      orderData,
      finalItems,
      finalDiscount?.id ?? undefined,
      finalDiscount?.usageLimit ?? undefined,
    )) as any;

    let payment;
    try {
      payment = await this.createPaymentRecord(order.id, dto.paymentMethod, ipAddr, order.status);
      
      // Log để kiểm tra ngay tại Server
      this.logger.debug(`[OrderCreation] Created payment for ${order.orderCode}: ${payment ? 'OK' : 'NULL'}`);
      if (payment) {
        this.logger.debug(`[OrderCreation] Link detail: ${payment.paymentLink ? 'FOUND' : 'NOT FOUND'}`);
      }

      if (dto.paymentMethod === 'VNPAY' && (!payment || !payment.paymentLink)) {
        throw new Error('Hệ thống không thể tạo liên kết thanh toán VNPay. Vui lòng kiểm tra lại cấu hình.');
      }
    } catch (error) {
      this.logger.error(`Failed to create payment for order ${order.id}. Initiating rollback. Error: ${error.message}`);
      
      // Rollback order and stock mapping safely if payment creation completely fails
      await this.repository.cancelAndRestore(order.id);
      
      throw new BadRequestException(error.message || 'Lỗi hệ thống khi tạo giao dịch thanh toán.');
    }

    await this.clearUserCartIfNeeded(userId, dto);
    if (userId) await this.cacheService.deleteUserOrderCaches(userId);
    await this.sendConfirmationEmail(order);

    // Trả về dữ liệu cực kỳ tường minh
    return {
      ...order,
      payment: payment,
      paymentLink: payment?.paymentLink || null,
      discountNote,
    };
  }

  private async getItemsToOrder(userId: number | null, dto: CreateOrderDto, isStaff: boolean) {
    if (dto.items && dto.items.length > 0) {
      return await this.prepareItemsFromDto(dto.items, isStaff);
    } else {
      if (!userId) {
        throw new BadRequestException(
          'Guest checkout requires items in request body',
        );
      }
      return await this.prepareItemsFromCart(userId);
    }
  }

  private async prepareItemsFromDto(
    items: Array<{ variantId: number; quantity: number; price?: number }>,
    isStaff: boolean,
  ) {
    const variantIds = items.map((item) => item.variantId);
    const variants = await this.prisma.productVariant.findMany({
      where: { 
        id: { in: variantIds },
        isActive: true,
        product: { deletedAt: null, isActive: true } 
      },
      select: {
        id: true, 
        productId: true, 
        price: true, 
        originalPrice: true, 
        weight: true, 
        length: true, 
        width: true, 
        height: true,
        size: true,
        color: true,
        images: { select: { url: true } },
        product: {
          select: { 
            id: true, 
            name: true, 
            slug: true,
            isActive: true, 
            deletedAt: true, 
            originalPrice: true, 
            categoryId: true, 
            category: { select: { name: true } },
            brand: { select: { name: true } },
            images: { select: { url: true }, take: 1 }
          },
        },
      },
    });

    if (!variants || variants.length === 0) {
      throw new BadRequestException('Không tìm thấy sản phẩm');
    }

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    // Phát hiện và báo lỗi rõ ràng các variant không khả dụng (đã xóa/inactive/không tồn tại).
    // Không silently drop để tránh tạo đơn thiếu sản phẩm.
    const missingIds = items
      .map((i) => i.variantId)
      .filter((id) => !variantMap.has(id));
    if (missingIds.length > 0) {
      throw new BadRequestException(
        `Một số sản phẩm không khả dụng hoặc đã ngừng kinh doanh (variantId: ${missingIds.join(', ')})`,
      );
    }

    return items.map((item) => {
      const variant = variantMap.get(item.variantId)!;
      const brandName = (variant.product as any)?.brand?.name || 'LUXE Boutique';
      const variantImage = variant.images?.[0]?.url || variant.product?.images?.[0]?.url || null;

      return {
        variantId: item.variantId,
        productId: variant.productId,
        quantity: item.quantity,
        // Trả về GIÁ GỐC của variant (không pre-apply Flash Sale).
        // Auto-apply / voucher sẽ được so sánh và quyết định ở `create()`.
        // Staff (Admin/POS) có thể override giá thủ công qua item.price.
        price: (item.price !== undefined && isStaff) ? item.price : variant.price,
        originalPrice: variant.originalPrice || variant.product?.originalPrice,
        productName: variant.product?.name || 'Sản phẩm',
        weight: variant.weight,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        category: (variant.product as any)?.category?.name,
        variantSnapshot: {
          color: variant.color,
          size: variant.size,
          image: variantImage,
          productName: variant.product?.name,
          productSlug: (variant.product as any)?.slug || null,
          brandName: brandName,
          originalPrice: variant.originalPrice || variant.product?.originalPrice || variant.price,
          // Lưu kích thước vật lý vào snapshot để syncToGHN có thể đọc khi variant đã bị xóa
          weight: variant.weight,
          length: variant.length,
          width: variant.width,
          height: variant.height,
        }
      };
    });
  }

  private async prepareItemsFromCart(userId: number) {
    const cart = await this.cartService.getCart(userId);
    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    // Loại bỏ trước các item có variant/product không khả dụng và báo lỗi rõ ràng,
    // tránh tình trạng vẫn order được sản phẩm đã xóa/inactive.
    const invalidItems = cart.cartItems.filter((item: any) => {
      const v = item.variant;
      if (!v) return true;
      if (v.isActive === false || v.deletedAt) return true;
      const p = v.product;
      if (!p || p.isActive === false || p.deletedAt) return true;
      return false;
    });
    if (invalidItems.length > 0) {
      const names = invalidItems
        .map((it: any) => it.variant?.product?.name || `variant#${it.variantId}`)
        .join(', ');
      throw new BadRequestException(
        `Một số sản phẩm trong giỏ đã ngừng kinh doanh, vui lòng xóa khỏi giỏ hàng: ${names}`,
      );
    }

    return cart.cartItems.map((item) => {
      const v = item.variant;
      const brandName = (v as any)?.product?.brand?.name || 'LUXE Boutique';
      const variantImage = v?.images?.[0]?.url || v?.product?.images?.[0]?.url || null;

      return {
        variantId: item.variantId,
        productId: item.variant?.productId,
        quantity: item.quantity,
        // Trả về GIÁ GỐC. Auto-apply Flash Sale & voucher sẽ được so sánh ở `create()`.
        price: item.variant?.price || 0,
        originalPrice: item.variant?.originalPrice || item.variant?.product?.originalPrice,
        productName: item.variant?.product?.name || 'Sản phẩm',
        weight: item.variant?.weight,
        length: item.variant?.length,
        width: item.variant?.width,
        height: item.variant?.height,
        category: item.variant?.product?.category?.name,
        variantSnapshot: {
          color: v?.color,
          size: v?.size,
          image: variantImage,
          productName: v?.product?.name,
          productSlug: v?.product?.slug || null,
          brandName: brandName,
          originalPrice: v?.originalPrice || v?.product?.originalPrice || v?.price,
          // Lưu kích thước vật lý vào snapshot để syncToGHN có thể đọc khi variant đã bị xóa
          weight: v?.weight,
          length: v?.length,
          width: v?.width,
          height: v?.height,
        }
      };
    });
  }

  private async calculateGHNFee(dto: CreateOrderDto, items: any[]) {
    let districtCode: string | null = null;
    let wardCode: string | null = null;

    if (dto.addressId) {
      const address = await this.prisma.address.findUnique({
        where: { id: dto.addressId },
      });
      if (address) {
        districtCode = address.districtCode;
        wardCode = address.wardCode;
      }
    } else if (dto.shippingInfo) {
      districtCode = dto.shippingInfo.districtCode;
      wardCode = dto.shippingInfo.wardCode;
    }

    if (!districtCode || !wardCode) return null;

    const totalWeight = items.reduce(
      (sum, item) => sum + (item.weight || 200) * item.quantity,
      0,
    );
    const maxLength = Math.max(...items.map((i) => i.length || 10));
    const maxWidth = Math.max(...items.map((i) => i.width || 10));
    const totalHeight = items.reduce(
      (sum, i) => sum + (i.height || 5) * i.quantity,
      0,
    );

    const fromDistrictId = Number(
      this.configService.get('GHN_FROM_DISTRICT_ID'),
    );
    if (!fromDistrictId) return null;

    const feeData = {
      from_district_id: fromDistrictId,
      service_id: 0,
      service_type_id: 2,
      to_district_id: Number(districtCode),
      to_ward_code: wardCode,
      height: Math.min(totalHeight, 150),
      length: Math.min(maxLength, 150),
      weight: Math.min(totalWeight, 30000),
      width: Math.min(maxWidth, 150),
      insurance_value: 0,
      coupon: null,
    };

    const result = await this.ghnService.calculateFee(feeData);
    return result.data.total;
  }

  private async validateDiscount(discountCode?: string, subtotal?: number, userId?: number | null, guestEmail?: string | null, guestPhone?: string | null) {
    if (!discountCode) return null;
    this.logger.debug(`[OrderCreation] Validating discount: ${discountCode} for userId: ${userId}`);
    const discount = await this.repository.findDiscountByCode(discountCode);
    if (!discount) throw new BadRequestException('Mã giảm giá không tồn tại');
    if (discount.isFlashSale)
      throw new BadRequestException('Mã Flash Sale đã được áp dụng tự động');

    // Single source of truth: dùng field Discount.usageCount thay vì count Order
    OrderHelper.validateDiscount(discount, subtotal, discount.usageCount);

    // Kiểm tra giới hạn sử dụng của người dùng/guest (mỗi người dùng 1 lần)
    const hasUsed = await this.repository.hasUsedDiscount(userId || null, discount.id, guestEmail, guestPhone);
    this.logger.debug(`[OrderCreation] User/Guest has used discount ${discount.id}: ${hasUsed}`);
    if (hasUsed) {
      throw new BadRequestException('Bạn đã sử dụng mã giảm giá này cho đơn hàng trước đó');
    }

    return discount;
  }

  private async createPaymentRecord(orderId: number, paymentMethod?: string, ipAddr: string = '127.0.0.1', orderStatus?: string) {
    // Chuẩn hóa phương thức thanh toán: COD từ frontend -> CASH trong enum
    const method = paymentMethod?.toUpperCase();
    let finalMethod = 'CASH';

    if (method === 'VNPAY' || method === 'PAYOS') {
      finalMethod = 'VNPAY';
    } else if (method === 'MOMO') {
      finalMethod = 'MOMO';
    } else if (method === 'CARD') {
      finalMethod = 'CARD';
    }

    const payment = await this.paymentService.create({
      orderId,
      method: finalMethod as any,
      status: orderStatus === 'DELIVERED' ? 'SUCCESS' : 'PENDING'
    }, ipAddr);

    return payment;
  }

  private async clearUserCartIfNeeded(
    userId: number | null,
    dto: CreateOrderDto,
  ) {
    if (!userId) return;
    if (dto.items && dto.items.length > 0) return;

    // Chỉ clear cart ngay khi đơn KHÔNG cần chờ thanh toán online (COD/CASH/POS).
    // Với VNPAY/PAYOS, cart sẽ được clear khi IPN trả SUCCESS (tránh việc user
    // bỏ thanh toán giữa chừng → đơn bị auto-cancel mà giỏ hàng đã trắng).
    const onlineMethods = ['VNPAY', 'PAYOS'];
    const method = (dto.paymentMethod || '').toUpperCase();
    if (onlineMethods.includes(method)) return;

    await this.repository.clearUserCart(userId);
  }

  private async sendConfirmationEmail(order: any) {
    const emailData = OrderHelper.prepareOrderEmailDetails(order);
    if (emailData.customerEmail && order.orderCode) {
      this.mailService
        .sendOrderConfirmation(
          emailData.customerEmail,
          order.orderCode,
          emailData.orderDetails,
        )
        .catch((err) => {
          this.logger.error('Failed to send confirmation email:', err);
        });
    }
  }
}
