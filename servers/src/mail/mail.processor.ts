
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
    this.logger.log('MailProcessor initialized and listening for jobs...');
  }

  async process(job: Job<any>): Promise<any> {
    const { type, data } = job.data;
    this.logger.log(`Processing mail job: ${type} for ${data.email}`);

    try {
      switch (type) {
        case 'verification':
          await this.mailerService.sendMail({
            to: data.email,
            subject: 'Mã xác thực tài khoản Minh Tuấn Shop',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #333;">Chào ${data.name || 'bạn'},</h2>
                <p>Mã xác thực của bạn là:</p>
                <div style="background: #f4f4f4; padding: 15px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; color: #007bff;">
                  ${data.otp}
                </div>
                <p>Mã này có hiệu lực trong 10 phút. Vui lòng không cung cấp mã này cho bất kỳ ai.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">Đây là email tự động, vui lòng không phản hồi.</p>
              </div>
            `,
          });
          break;

        case 'reset-password':
          await this.mailerService.sendMail({
            to: data.email,
            subject: 'Mã đặt lại mật khẩu Minh Tuấn Shop',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
                <p>Chào ${data.name || 'bạn'}, mã OTP để đặt lại mật khẩu của bạn là:</p>
                <div style="background: #fff3cd; padding: 15px; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 5px; color: #856404;">
                  ${data.otp}
                </div>
                <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
              </div>
            `,
          });
          break;

        case 'order-confirmation':
          await this.mailerService.sendMail({
            to: data.email,
            subject: `Xác nhận đơn hàng ${data.orderCode}`,
            html: data.html,
          });
          break;

        default:
          this.logger.warn(`Unknown mail job type: ${type}`);
      }
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send email ${type} to ${data.email}:`, error.stack);
      throw error; // BullMQ will retry based on config
    }
  }
}
