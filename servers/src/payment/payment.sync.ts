// src/payment/services/payment-sync.service.ts
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { PayOSService } from '../payos/payos.service';
import { PaymentCache } from './payment.cache';
import * as PaymentHelper from './payment.helper';

@Injectable()
export class PaymentSync {
  private readonly logger = new Logger(PaymentSync.name);

  constructor(
    private repository: PaymentRepository,
    private payosService: PayOSService,
    private cacheService: PaymentCache,
  ) {}

  async findByPayosOrderCodeWithSync(orderCode: number) {
    const payment = await this.repository.findByPayosOrderCode(orderCode);
    
    if (!payment) {
      return null;
    }
    
    if (payment.status === 'PENDING') {
      try {
        this.logger.log(`🔄 Payment ${payment.id} is PENDING, syncing with PayOS...`);
        const payosInfo = await this.payosService.getPaymentInfo(orderCode);
        this.logger.log('📡 PayOS info:', { status: payosInfo.status });
        if (payosInfo.status === 'PAID') {
          const updatedPayment = await this.updatePaymentToSuccess(payment);
          return this.formatPaymentResponse(updatedPayment, payment.order);
        }
      } catch (error) {
        this.logger.warn('⚠️ Failed to sync with PayOS:', error.message);
      }
    }
    
    return this.formatPaymentResponse(payment, payment.order);
  }

  private formatPaymentResponse(payment: any, order: any) {
    return {
      payment: PaymentHelper.serializePayment(payment),
      order: order ? {
        id: order.id,
        orderCode: order.orderCode,
        status: order.status,
        total: order.total,
        shippingInfo: order.shippingInfo,
        orderItems: order.orderItems,
      } : null,
    };
  }

  async syncPaymentWithPayOS(paymentId: number) {
    const payment = await this.repository.findById(paymentId);
    
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (!payment.payosOrderCode) {
      throw new BadRequestException('This payment does not have a PayOS order code');
    }

    if (payment.status !== 'PENDING') {
      this.logger.log(`Payment ${paymentId} is already ${payment.status}, skipping sync`);
      return {
        message: `Payment is already ${payment.status}`,
        payment: PaymentHelper.serializePayment(payment),
      };
    }

    try {
      this.logger.log(`🔄 Manually syncing payment ${paymentId} with PayOS orderCode ${payment.payosOrderCode}...`);
      
      const payosInfo = await this.payosService.getPaymentInfo(Number(payment.payosOrderCode));
      this.logger.log(`📡 PayOS info:`, { status: payosInfo.status });
      
      if (payosInfo.status === 'PAID') {
        const updatedPayment = await this.updatePaymentToSuccess(payment);
        return {
          message: 'Payment synced successfully - Status updated to SUCCESS',
          payment: PaymentHelper.serializePayment(updatedPayment),
        };
      } else if (payosInfo.status === 'CANCELLED') {
        const updatedPayment = await this.updatePaymentToCancelled(payment);
        return {
          message: 'Payment synced - Status updated to CANCELLED',
          payment: PaymentHelper.serializePayment(updatedPayment),
        };
      } else {
        return {
          message: `Payment is still PENDING on PayOS (status: ${payosInfo.status})`,
          payment: PaymentHelper.serializePayment(payment),
        };
      }
    } catch (error) {
      this.logger.error(`❌ Failed to sync payment ${paymentId} with PayOS:`, error.message);
      throw new BadRequestException(`Failed to sync with PayOS: ${error.message}`);
    }
  }

  private async updatePaymentToSuccess(payment: any) {
    this.logger.log('✅ PayOS confirmed payment is PAID, updating status to SUCCESS...');
    
    const updatedPayment = await this.repository.updateStatusWithTransaction(
      payment.id,
      'SUCCESS',
      payment.orderId,
      payment.order.orderItems,
    );
    
    await this.cacheService.clearRelatedCaches(payment.id, payment.orderId);
    this.logger.log('✅ Payment status synced successfully to SUCCESS');
    
    return updatedPayment;
  }

  private async updatePaymentToCancelled(payment: any) {
    const updatedPayment = await this.repository.update(payment.id, {
      status: 'CANCELLED',
    });
    
    await this.cacheService.deletePayment(payment.id);
    await this.cacheService.clearPaymentCaches();
    
    return updatedPayment;
  }
}