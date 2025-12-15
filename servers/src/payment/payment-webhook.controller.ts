// src/payment/payment-webhook.controller.ts
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

/**
 * Public webhook & payment verification controller - không cần authentication
 * Dành cho các payment gateway gọi callback và public payment verification
 */
@ApiTags('Payment Webhooks')
@Controller('webhooks/payments')
export class PaymentWebhookController {
  constructor(private paymentService: PaymentService) {}

  @Post('payos')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook từ PayOS để cập nhật trạng thái thanh toán (Public endpoint)' })
  async handlePayOSWebhook(@Body() webhookData: any) {
    console.log('📥 PayOS Webhook received:', JSON.stringify(webhookData, null, 2));
    try {
      const result = await this.paymentService.handlePayOSWebhook(webhookData);
      console.log('✅ PayOS Webhook processed successfully:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ PayOS Webhook error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Public endpoint to verify payment and get order details
   * Used by PaymentReturn page after redirect from PayOS
   * No authentication required
   */
  @Get('payos/verify/:orderCode')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xác minh thanh toán PayOS và lấy thông tin đơn hàng (Public endpoint - không cần token)' })
  @ApiResponse({ status: 200, description: 'Xác minh thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy payment' })
  async verifyPaymentReturn(@Param('orderCode') orderCode: string) {
    console.log('🔍 Verifying payment for orderCode:', orderCode);
    try {
      const result = await this.paymentService.findByPayosOrderCode(+orderCode);
      console.log('✅ Payment verification successful:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Payment verification error:', error);
      return { success: false, error: error.message };
    }
  }
}