import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
import { CreateShippingOrderDto } from './dto/create-order.dto';

@Injectable()
export class ShippingService {
  private readonly ghtkApiUrl: string;
  private readonly ghtkToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Sử dụng test environment để FREE
    this.ghtkApiUrl =
      this.configService.get<string>('GHTK_API_URL') ||
      'https://services.giaohangtietkiem.vn/services/shipment/test';
    this.ghtkToken = this.configService.get<string>('GHTK_TOKEN') || '';
  }

  /**
   * Tính phí vận chuyển GHTK
   */
  async calculateShippingFee(dto: CalculateFeeDto) {
    try {
      const params = {
        pick_province: dto.pick_province,
        pick_district: dto.pick_district,
        province: dto.province,
        district: dto.district,
        address: dto.ward || dto.district,
        weight: dto.weight,
        value: dto.value || 0,
        deliver_option: dto.deliver_option || 'none',
      };

      const response = await firstValueFrom(
        this.httpService.get(`${this.ghtkApiUrl}/fee`, {
          headers: {
            Token: this.ghtkToken,
          },
          params,
        }),
      );

      if (!response.data.success) {
        throw new BadRequestException(
          response.data.message || 'Không thể tính phí vận chuyển',
        );
      }

      return {
        success: true,
        fee: response.data.fee.fee || 0, // Phí ship
        insurance_fee: response.data.fee.insurance_fee || 0, // Phí bảo hiểm
        delivery_time: response.data.fee.delivery || 'Không xác định', // Thời gian giao hàng dự kiến
        total: (response.data.fee.fee || 0) + (response.data.fee.insurance_fee || 0),
      };
    } catch (error) {
      console.error('GHTK Calculate Fee Error:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Lỗi khi tính phí vận chuyển GHTK',
      );
    }
  }

  /**
   * Tạo đơn vận chuyển GHTK
   */
  async createShippingOrder(dto: CreateShippingOrderDto) {
    try {
      const orderData = {
        products: dto.products,
        order: {
          id: `ORDER_${Date.now()}`, // Mã đơn hàng của bạn
          pick_name: dto.pick_name,
          pick_address: dto.pick_address,
          pick_province: dto.pick_province,
          pick_district: dto.pick_district,
          pick_tel: dto.pick_tel,
          tel: dto.tel,
          name: dto.name,
          address: dto.address,
          province: dto.province,
          district: dto.district,
          ward: dto.ward || '',
          email: dto.email || '',
          value: dto.value || 0,
          pick_money: dto.pick_money || 0,
          note: dto.note || '',
          is_freeship: 1, // 1 = shop trả phí ship, 0 = người nhận trả
        },
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.ghtkApiUrl}/order`, orderData, {
          headers: {
            Token: this.ghtkToken,
            'Content-Type': 'application/json',
          },
        }),
      );

      if (!response.data.success) {
        throw new BadRequestException(
          response.data.message || 'Không thể tạo đơn vận chuyển',
        );
      }

      return {
        success: true,
        tracking_code: response.data.order.tracking_id, // Mã vận đơn GHTK
        label_url: response.data.order.label, // URL in tem vận đơn
        estimated_fee: response.data.order.fee || 0,
        estimated_delivery: response.data.order.estimated_deliver_time,
      };
    } catch (error) {
      console.error('GHTK Create Order Error:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Lỗi khi tạo đơn vận chuyển GHTK',
      );
    }
  }

  /**
   * Kiểm tra trạng thái đơn hàng
   */
  async trackOrder(trackingCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.ghtkApiUrl}/status/${trackingCode}`, {
          headers: {
            Token: this.ghtkToken,
          },
        }),
      );

      if (!response.data.success) {
        throw new BadRequestException(
          response.data.message || 'Không tìm thấy đơn hàng',
        );
      }

      return {
        success: true,
        status: response.data.order.status_text,
        status_id: response.data.order.status_id,
        created_at: response.data.order.created,
        deliver_date: response.data.order.deliver_date,
      };
    } catch (error) {
      console.error('GHTK Track Order Error:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Lỗi khi tra cứu đơn hàng',
      );
    }
  }
}
