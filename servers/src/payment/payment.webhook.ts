
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { PayOSService } from '../payos/payos.service';
import { PaymentCache } from './payment.cache';
import * as PaymentHelper from './payment.helper';

@Injectable()
export class PaymentWebhook {
  private readonly logger = new Logger(PaymentWebhook.name);

  constructor(
    private repository: PaymentRepository,
    private payosService: PayOSService,
    private cacheService: PaymentCache,
  ) {}

  
  async handlePayOSWebhook(webhookData: any) {
    try {

      const verifiedData = await this.payosService.verifyPaymentWebhookData(webhookData);

      const orderCode = verifiedData.orderCode;

      const payment = await this.repository.findByPayosOrderCode(orderCode.toString());
      if (!payment) {
        this.logger.error('Payment not found for orderCode:', orderCode);
        throw new NotFoundException(`Payment not found for order code: ${orderCode}`);
      }

      this.logger.log('💳 Found payment:', { 
        paymentId: payment.id, 
        orderId: payment.orderId, 
        currentStatus: payment.status 
      });

      const newStatus = this.determinePaymentStatus(verifiedData.code);

      const updatedPayment = await this.repository.updateStatusWithTransaction(
        payment.id,
        newStatus,
        payment.orderId,
        payment.order.orderItems,
      );

      this.logger.log(' Payment updated successfully:', { 
        id: updatedPayment.id, 
        status: updatedPayment.status, 
        orderId: updatedPayment.orderId 
      });

      await this.cacheService.clearRelatedCaches(payment.id, payment.orderId);

      return PaymentHelper.serializePayment(updatedPayment);
    } catch (error) {
      this.logger.error('Error handling PayOS webhook:', error);
      throw new BadRequestException(`Failed to handle webhook: ${error.message}`);
    }
  }

  
  private determinePaymentStatus(code: string): 'SUCCESS' | 'FAILED' | 'CANCELLED' {
    switch (code) {
      case '00':
        return 'SUCCESS';
      case '01':
        return 'FAILED';
      case '02':
        return 'CANCELLED';
      default:
        return 'FAILED';
    }
  }
}





