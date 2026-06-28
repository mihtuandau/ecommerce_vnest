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
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/create`,
          orderData,
          {
            headers: {
              'Content-Type': 'application/json',
              Token: this.ghnToken,
              ShopId: this.shopId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'GHN Create Order Error:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Lấy danh sách dịch vụ vận chuyển khả dụng giữa 2 quận/huyện
   */
  async getAvailableServices(fromDistrict: number, toDistrict: number) {
    if (!fromDistrict || !toDistrict) return [];
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/available-services`,
          {
            shop_id: this.shopId,
            from_district: fromDistrict,
            to_district: toDistrict,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Token: this.ghnToken,
            },
          },
        ),
      );
      return response.data?.data || [];
    } catch (error) {
      this.logger.error(
        `GHN Get Available Services Error (From ${fromDistrict} to ${toDistrict}):`,
        error.response?.data || error.message,
      );
      return [];
    }
  }

  /**
   * Tính phí vận chuyển
   */
  async calculateFee(feeData: any) {
    const fromDistrictId = Number(
      this.configService.get<string>('GHN_FROM_DISTRICT_ID') || 0,
    );
    const toDistrictId = Number(feeData.to_district_id || 0);

    let serviceId = 0;
    if (fromDistrictId && toDistrictId) {
      const services = await this.getAvailableServices(
        fromDistrictId,
        toDistrictId,
      );
      if (services && services.length > 0) {
        serviceId = services[0].service_id;
      }
    }

    // Đảm bảo các thông số mặc định nếu thiếu
    const finalData: any = {
      from_district_id: fromDistrictId,
      height: 10,
      length: 10,
      width: 10,
      weight: 1000,
      insurance_value: 0,
      coupon: null,
      ...feeData,
    };

    if (serviceId) {
      finalData.service_id = serviceId;
    } else {
      // Nếu không tìm thấy dịch vụ nào hoặc API lỗi, loại bỏ hoàn toàn service_id để không bị lỗi 400 tag validation
      delete finalData.service_id;
      finalData.service_type_id = 2; // Hàng nhẹ/tiêu chuẩn
    }

    // Chuyển đổi các trường số nếu cần
    if (finalData.to_district_id)
      finalData.to_district_id = Number(finalData.to_district_id);

    // Đảm bảo weight luôn dương và là số nguyên
    finalData.weight = Math.max(1000, Number(finalData.weight || 1000));

    try {
      if (!this.ghnToken || !this.shopId) {
        throw new Error('GHN config missing (Token or ShopId)');
      }

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/fee`,
          finalData,
          {
            headers: {
              'Content-Type': 'application/json',
              Token: this.ghnToken,
              ShopId: this.shopId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'GHN Calculate Fee Error:',
        error.response?.data || error.message,
      );
      // Trả về phí ship mặc định (ví dụ 30,000đ) nếu API GHN lỗi để khách vẫn có thể đặt hàng
      return {
        code: 200,
        message: 'Fallback fee used due to GHN error',
        data: { total: 30000 },
      };
    }
  }

  /**
   * Lấy danh sách Tỉnh/Thành phố
   */
  async getProvinces() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/master-data/province`, {
          headers: { Token: this.ghnToken },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'GHN Get Provinces Error:',
        error.response?.data || error.message,
      );
      return { data: [] };
    }
  }

  /**
   * Lấy danh sách Quận/Huyện theo Tỉnh
   */
  async getDistricts(provinceId: number) {
    if (!provinceId) return { data: [] };
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/master-data/district?province_id=${provinceId}`,
          {
            headers: { Token: this.ghnToken },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `GHN Get Districts Error (Province ${provinceId}):`,
        error.response?.data || error.message,
      );
      return { data: [] };
    }
  }

  /**
   * Lấy danh sách Phường/Xã theo Quận
   */
  async getWards(districtId: number) {
    if (!districtId) return { data: [] };
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/master-data/ward?district_id=${districtId}`,
          {
            headers: { Token: this.ghnToken },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `GHN Get Wards Error (District ${districtId}):`,
        error.response?.data || error.message,
      );
      return { data: [] };
    }
  }

  /**
   * Lấy thông tin chi tiết đơn hàng từ GHN
   */
  async getOrderDetail(orderCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/detail`,
          { order_code: orderCode },
          { headers: { Token: this.ghnToken } },
        ),
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching GHN order detail for ${orderCode}:`,
        error.message,
      );
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
        this.httpService.post(
          `${this.apiUrl}/v2/shipping-order/update`,
          {
            order_codes: [orderCode],
            status: status,
          },
          { headers: { Token: this.ghnToken } },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error updating GHN Sandbox status for ${orderCode}:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * Phân tích Webhook từ GHN để lấy mã đơn hàng và trạng thái tương ứng
   */
  async handleStatusWebhook(payload: any) {
    const { Status, OrderCode, Description, Warehouse } = payload;

    if (!OrderCode || !Status) {
      return null;
    }

    // Ánh xạ trạng thái GHN sang trạng thái hệ thống local
    const statusMapping: Record<string, string> = {
      ready_to_pick: 'PROCESSING',
      picking: 'PROCESSING',
      money_collect_picking: 'PROCESSING',
      picked: 'PROCESSING',
      storing: 'PROCESSING',
      stored: 'PROCESSING',
      transporting: 'SHIPPED',
      sorting: 'SHIPPED',
      delivering: 'SHIPPED',
      money_collect_delivering: 'SHIPPED',
      delivered: 'DELIVERED',
      delivery_fail: 'CANCELLED',
      waiting_to_return: 'CANCELLED',
      return: 'CANCELLED',
      returned: 'RETURNED',
      cancel: 'CANCELLED',
    };

    const statusKey = Status.toLowerCase();
    const newStatus = statusMapping[statusKey];

    if (!newStatus) {
      this.logger.warn(
        `[GHN Webhook] Status '${Status}' not mapped to any local status`,
      );
      return null;
    }

    return {
      shippingCode: OrderCode,
      status: newStatus,
      description: Description,
      warehouse: Warehouse,
      originalStatus: Status,
    };
  }
}
