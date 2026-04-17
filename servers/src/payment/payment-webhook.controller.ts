
import { 
  Controller, 
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';


@ApiTags('Payment Webhooks')
@Controller('webhooks/payments')
export class PaymentWebhookController {
  constructor(private paymentService: PaymentService) {}

  @Post('payos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook từ PayOS để cập nhật trạng thái thanh toán (Public endpoint)' })
  async handlePayOSWebhook(@Body() webhookData: any) {

    try {
      const result = await this.paymentService.handlePayOSWebhook(webhookData);

      return { success: true, data: result };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }

  
  @Get('payos/verify/:orderCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác minh thanh toán PayOS và lấy thông tin đơn hàng (Public endpoint - không cần token)' })
  @ApiResponse({ status: 200, description: 'Xác minh thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy payment' })
  async verifyPaymentReturn(@Param('orderCode') orderCode: string) {

    try {
      const result = await this.paymentService.findByPayosOrderCode(orderCode);

      return { success: true, data: result };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }
}





