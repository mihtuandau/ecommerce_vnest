// src/payment/payment-webhook.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

/**
 * Public webhook controller - không cần authentication
 * Dành cho các payment gateway gọi callback
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
}
