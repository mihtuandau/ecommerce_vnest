import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOrderConfirmation(
    email: string,
    orderCode: string,
    orderDetails: any,
  ) {
    const { customerName, items, total, shippingAddress } = orderDetails;

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${item.productName}
            ${item.size ? `<br><small>Size: ${item.size}</small>` : ''}
            ${item.color ? `<br><small>Màu: ${item.color}</small>` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ${this.formatCurrency(item.price * item.quantity)}
          </td>
        </tr>
      `,
      )
      .join('');

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Xác nhận đơn hàng ${orderCode}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
              .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .order-code { font-size: 24px; font-weight: bold; color: #667eea; margin: 10px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; }
              .total-row { font-weight: bold; background: #f8f9fa; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1> Đặt hàng thành công!</h1>
                <p>Cảm ơn bạn đã tin tưởng mua sắm tại cửa hàng</p>
              </div>
              
              <div class="content">
                <div class="order-info">
                  <p style="margin: 0; color: #666;">Mã đơn hàng</p>
                  <div class="order-code">${orderCode}</div>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                    Đơn hàng của bạn đã được đặt thành công và đang chờ xử lý
                  </p>
                </div>

                <h3>Chi tiết đơn hàng</h3>
                <p><strong>Người nhận:</strong> ${customerName}</p>
                <p><strong>Địa chỉ:</strong> ${shippingAddress}</p>

                <table>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th style="text-align: center;">Số lượng</th>
                      <th style="text-align: right;">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr class="total-row">
                      <td colspan="2" style="padding: 15px; text-align: right;">Tổng cộng:</td>
                      <td style="padding: 15px; text-align: right; color: #667eea; font-size: 18px;">
                        ${this.formatCurrency(total)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-lookup" class="button">
                    Tra cứu đơn hàng
                  </a>
                </div>

                <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107;">
                  <p style="margin: 0;"><strong>📝 Lưu ý:</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    Vui lòng lưu lại mã đơn hàng <strong>${orderCode}</strong> để tra cứu và theo dõi trạng thái đơn hàng.
                  </p>
                </div>
              </div>

              <div class="footer">
                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi</p>
                <p>Email: support@example.com | Hotline: 1900-xxxx</p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                  Email này được gửi tự động, vui lòng không trả lời email này.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (error) {}
  }

  async sendPasswordReset(email: string, resetUrl: string, userName?: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f093fb 0%, #122ddcff 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
              .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
              .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #ffc107; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Đặt lại mật khẩu</h1>
                <p>Yêu cầu khôi phục mật khẩu</p>
              </div>
              
              <div class="content">
                <p>Xin chào ${userName || 'bạn'},</p>
                
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>📌 Lưu ý quan trọng:</strong></p>
                  <ul style="margin: 10px 0 0 20px; padding: 0;">
                    <li>Link chỉ có hiệu lực trong <strong>1 giờ</strong></li>
                    <li>Không chia sẻ link này với bất kỳ ai</li>
                    <li>Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này</li>
                  </ul>
                </div>

                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">
                    Đặt lại mật khẩu
                  </a>
                </div>

                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                  Hoặc copy link sau vào trình duyệt:<br>
                  <a href="${resetUrl}" style="color: #f5576c; word-break: break-all;">${resetUrl}</a>
                </p>

                <div class="warning">
                  <p style="margin: 0;"><strong>⚠️ Cảnh báo bảo mật:</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">
                    Nếu bạn không yêu cầu đặt lại mật khẩu, có thể có người đang cố gắng truy cập vào tài khoản của bạn. 
                    Vui lòng đổi mật khẩu ngay lập tức hoặc liên hệ với chúng tôi.
                  </p>
                </div>
              </div>

              <div class="footer">
                <p>Nếu bạn gặp vấn đề với nút bên trên, hãy copy và paste link vào trình duyệt</p>
                <p>Email: support@example.com | Hotline: 1900-xxxx</p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                  Email này được gửi tự động, vui lòng không trả lời email này.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (error) {
      throw error;
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
}
