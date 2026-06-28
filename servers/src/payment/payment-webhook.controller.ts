import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('Payment Webhooks')
@Controller('webhooks/payments')
export class PaymentWebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('vnpay')
  @ApiOperation({ summary: 'VNPay IPN (Instant Payment Notification)' })
  async handleVNPayIPN(@Query() query: any) {
    return this.paymentService.handleVNPayIPN(query);
  }
}
