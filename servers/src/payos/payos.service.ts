// src/payos/payos.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS } from '@payos/node';

export interface PayOSPaymentData {
  orderCode: number;
  amount: number;
  description: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PayOSWebhookData {
  code: string;
  desc: string;
  success: boolean;
  data: {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId?: string;
    counterAccountBankName?: string;
    counterAccountName?: string;
    counterAccountNumber?: string;
    virtualAccountName?: string;
    virtualAccountNumber?: string;
  };
  signature: string;
}

@Injectable()
export class PayOSService {
  private readonly logger = new Logger(PayOSService.name);
  private payOS: PayOS;
  private returnUrl: string;
  private cancelUrl: string;

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('payos.clientId');
    const apiKey = this.configService.get<string>('payos.apiKey');
    const checksumKey = this.configService.get<string>('payos.checksumKey');

    if (!clientId || !apiKey || !checksumKey) {
      this.logger.warn('PayOS credentials not configured properly');
    }

    this.payOS = new PayOS({
      clientId,
      apiKey,
      checksumKey,
    });
    this.returnUrl = this.configService.get<string>('payos.returnUrl') || 'http://localhost:5173/payment/return';
    this.cancelUrl = this.configService.get<string>('payos.cancelUrl') || 'http://localhost:5173/payment/cancel';
  }

  /**
   * Tạo payment link từ PayOS
   */
  async createPaymentLink(paymentData: PayOSPaymentData) {
    try {
      const body = {
        orderCode: paymentData.orderCode,
        amount: paymentData.amount,
        description: paymentData.description,
        buyerName: paymentData.buyerName,
        buyerEmail: paymentData.buyerEmail,
        buyerPhone: paymentData.buyerPhone,
        buyerAddress: paymentData.buyerAddress,
        items: paymentData.items || [],
        returnUrl: paymentData.returnUrl || this.returnUrl,
        cancelUrl: paymentData.cancelUrl || this.cancelUrl,
      };

      this.logger.log(`Creating PayOS payment link for order: ${paymentData.orderCode}`);
      const paymentLinkResponse = await this.payOS.paymentRequests.create(body);

      this.logger.log(`PayOS payment link created successfully: ${paymentLinkResponse.checkoutUrl}`);
      return paymentLinkResponse;
    } catch (error) {
      this.logger.error(`Error creating PayOS payment link: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create payment link: ${error.message}`);
    }
  }

  /**
   * Lấy thông tin payment từ PayOS
   */
  async getPaymentInfo(orderCode: number) {
    try {
      this.logger.log(`Getting payment info for order: ${orderCode}`);
      const paymentInfo = await this.payOS.paymentRequests.get(orderCode);
      return paymentInfo;
    } catch (error) {
      this.logger.error(`Error getting payment info: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to get payment info: ${error.message}`);
    }
  }

  /**
   * Hủy payment link
   */
  async cancelPaymentLink(orderCode: number, cancellationReason?: string) {
    try {
      this.logger.log(`Cancelling payment link for order: ${orderCode}`);
      const cancelResponse = await this.payOS.paymentRequests.cancel(orderCode, cancellationReason);
      return cancelResponse;
    } catch (error) {
      this.logger.error(`Error cancelling payment link: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to cancel payment link: ${error.message}`);
    }
  }

  /**
   * Xác thực webhook từ PayOS
   */
  async verifyPaymentWebhookData(webhookData: PayOSWebhookData) {
    try {
      const verifiedData = await this.payOS.webhooks.verify(webhookData);
      return verifiedData;
    } catch (error) {
      this.logger.error(`Error verifying webhook: ${error.message}`, error.stack);
      throw new BadRequestException(`Invalid webhook data: ${error.message}`);
    }
  }

  /**
   * Confirm webhook đã nhận
   */
  async confirmWebhook(webhookUrl: string) {
    try {
      return await this.payOS.webhooks.confirm(webhookUrl);
    } catch (error) {
      this.logger.error(`Error confirming webhook: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to confirm webhook: ${error.message}`);
    }
  }
}