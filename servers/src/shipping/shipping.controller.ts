import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CalculateFeeDto } from './dto/calculate-fee.dto';
import { CreateShippingOrderDto } from './dto/create-order.dto';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  /**
   * POST /shipping/calculate-fee
   * Tính phí vận chuyển GHTK
   */
  @Post('calculate-fee')
  async calculateFee(@Body() dto: CalculateFeeDto) {
    return this.shippingService.calculateShippingFee(dto);
  }

  /**
   * POST /shipping/create-order
   * Tạo đơn vận chuyển GHTK
   */
  @Post('create-order')
  async createOrder(@Body() dto: CreateShippingOrderDto) {
    return this.shippingService.createShippingOrder(dto);
  }

  /**
   * GET /shipping/track/:trackingCode
   * Tra cứu trạng thái đơn hàng
   */
  @Get('track/:trackingCode')
  async trackOrder(@Param('trackingCode') trackingCode: string) {
    return this.shippingService.trackOrder(trackingCode);
  }
}
