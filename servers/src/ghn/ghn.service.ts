import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GHNService {
  private readonly logger = new Logger(GHNService.name);
  private readonly ghnToken: string;
  private readonly shopId: number;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.ghnToken = this.configService.get<string>('GHN_TOKEN') as string;
    this.shopId = Number(this.configService.get<string>('GHN_SHOP_ID') || 0);
    this.apiUrl = this.configService.get<string>('GHN_API_URL') as string;
  }

  /**
   * Tạo đơn hàng nháp/thật trên hệ thống GHN
   */
  async createOrder(orderData: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/v2/shipping-order/create`, orderData, {
          headers: {
            'Content-Type': 'application/json',
            Token: this.ghnToken,
            ShopId: this.shopId,
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('GHN Create Order Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Tính phí vận chuyển
   */
  async calculateFee(feeData: any) {
    const fromDistrictId = Number(this.configService.get<string>('GHN_FROM_DISTRICT_ID'));
    
    // Đảm bảo các thông số mặc định nếu thiếu
    const finalData = {
      from_district_id: fromDistrictId,
      service_id: 0,
      service_type_id: 2, 
      height: 10,
      length: 10,
      width: 10,
      weight: 500,
      insurance_value: 0,
      coupon: null,
      ...feeData,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/v2/shipping-order/fee`, finalData, {
          headers: {
            'Content-Type': 'application/json',
            Token: this.ghnToken,
            ShopId: this.shopId,
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('GHN Calculate Fee Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Lấy danh sách Tỉnh/Thành phố
   */
  async getProvinces() {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/master-data/province`, {
        headers: { Token: this.ghnToken },
      }),
    );
    return response.data;
  }

  /**
   * Lấy danh sách Quận/Huyện theo Tỉnh
   */
  async getDistricts(provinceId: number) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/master-data/district?province_id=${provinceId}`, {
        headers: { Token: this.ghnToken },
      }),
    );
    return response.data;
  }

  /**
   * Lấy danh sách Phường/Xã theo Quận
   */
  async getWards(districtId: number) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/master-data/ward?district_id=${districtId}`, {
        headers: { Token: this.ghnToken },
      }),
    );
    return response.data;
  }

  /**
   * Lấy thông tin chi tiết đơn hàng từ GHN
   */
  async getOrderDetail(orderCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/v2/shipping-order/detail`, 
          { order_code: orderCode },
          { headers: { Token: this.ghnToken } }
        )
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching GHN order detail for ${orderCode}:`, error.message);
      return null;
    }
  }

  /**
   * API ĐẶC BIỆT: Cập nhật trạng thái đơn hàng trên môi trường SANDBOX của GHN
   * (Dùng để test tác động trực tiếp vào hệ thống GHN)
   */
  async updateOrderSandbox(orderCode: string, status: string) {
    try {
      // Lưu ý: Endpoint này chỉ dành cho Sandbox để hỗ trợ DEV test
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/v2/shipping-order/update`, 
          { 
            order_codes: [orderCode],
            status: status 
          },
          { headers: { Token: this.ghnToken } }
        )
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Error updating GHN Sandbox status for ${orderCode}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Xử lý Webhook cập nhật trạng thái đơn hàng từ GHN theo tài liệu chuẩn
   */
  async handleStatusWebhook(payload: any) {
    const { Status, OrderCode, Type, Description, Warehouse } = payload;
    
    this.logger.log(`[GHN Webhook] Received ${Status} for Order ${OrderCode} (Type: ${Type})`);

    if (!OrderCode || !Status) {
      return { success: false, message: 'Invalid payload' };
    }

    // Ánh xạ trạng thái GHN sang trạng thái hệ thống local (dựa trên tài liệu chuẩn)
    const statusMapping: Record<string, string> = {
      'ready_to_pick': 'PROCESSING',
      'picking': 'PROCESSING',
      'money_collect_picking': 'PROCESSING',
      'picked': 'PROCESSING',
      'storing': 'PROCESSING',
      'stored': 'PROCESSING',
      'transporting': 'SHIPPED',
      'sorting': 'SHIPPED',
      'delivering': 'SHIPPED',
      'money_collect_delivering': 'SHIPPED',
      'delivered': 'DELIVERED',
      'delivery_fail': 'CANCELLED',
      'waiting_to_return': 'CANCELLED',
      'return': 'CANCELLED',
      'returned': 'CANCELLED',
      'cancel': 'CANCELLED'
    };

    const statusKey = Status.toLowerCase();
    const newStatus = statusMapping[statusKey];

    if (!newStatus) {
      this.logger.warn(`[GHN Webhook] Status '${Status}' not mapped to any local status`);
      return { success: true, message: 'Status ignored' }; // Vẫn trả về 200 để GHN không gửi lại
    }

    try {
      // Tìm đơn hàng theo shippingCode (mã GHN)
      const order = await this.prisma.order.findFirst({
        where: { shippingCode: OrderCode }
      });

      if (!order) {
        this.logger.warn(`[GHN Webhook] Order not found for GHN Code: ${OrderCode}`);
        return { success: true, message: 'Order not matched' }; // Trả về 200 theo yêu cầu GHN
      }

      // Chỉ cập nhật nếu trạng thái thực sự thay đổi hoặc tiến tới
      const currentStatus = order.status;
      if (currentStatus !== newStatus && currentStatus !== 'DELIVERED') {
        await this.prisma.order.update({
          where: { id: order.id },
          data: { status: newStatus as any }
        });
        this.logger.log(`[GHN Webhook] Updated Order #${order.id} status: ${currentStatus} -> ${newStatus} (${Description || ''} at ${Warehouse || 'N/A'})`);
      }

      // Lưu ý: GHN yêu cầu trả về Response 200
      return { code: 200, message: 'Success' };
    } catch (error) {
      this.logger.error('[GHN Webhook] Error processing:', error.message);
      return { code: 200, message: 'Error processed' }; // Vẫn trả về 200 để tránh GHN retry vô ích
    }
  }
}
