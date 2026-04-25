import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  
  private readonly styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #f5f5f5;
      color: #1a1a1a;
      font-size: 14px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      background-color: #f5f5f5;
      padding: 48px 16px;
    }

    .container {
      max-width: 560px;
      margin: 0 auto;
    }

    /* Wordmark */
    .brand {
      text-align: center;
      margin-bottom: 24px;
    }
    .brand-name {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.3px;
    }

    /* Card */
    .card {
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      overflow: hidden;
    }

    .card-body {
      padding: 40px;
    }

    /* Section label at top */
    .section-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 12px;
    }

    h1 {
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.4px;
      line-height: 1.3;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 14px;
      color: #555;
      margin-bottom: 32px;
    }

    /* Divider */
    .divider {
      height: 1px;
      background-color: #ebebeb;
      margin: 28px 0;
    }

    /* Meta rows */
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 8px 0;
      font-size: 13px;
    }
    .meta-row + .meta-row {
      border-top: 1px solid #f0f0f0;
    }
    .meta-label { color: #888; }
    .meta-value { color: #1a1a1a; font-weight: 500; text-align: right; }

    /* Order code badge */
    .order-code-block {
      background: #f9f9f9;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 24px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .order-code-label { font-size: 12px; color: #888; margin-bottom: 2px; }
    .order-code-value {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.04em;
      font-variant-numeric: tabular-nums;
    }
    .order-badge {
      font-size: 11px;
      font-weight: 500;
      color: #16a34a;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 3px 8px;
      border-radius: 20px;
    }

    /* Items table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
    }
    .items-table th {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #888;
      padding: 0 0 10px 0;
      text-align: left;
      border-bottom: 1px solid #ebebeb;
    }
    .items-table th.right { text-align: right; }
    .items-table th.center { text-align: center; }

    .items-table td {
      padding: 12px 0;
      font-size: 13px;
      color: #1a1a1a;
      border-bottom: 1px solid #f5f5f5;
      vertical-align: top;
    }
    .items-table td.center { text-align: center; color: #555; }
    .items-table td.right { text-align: right; font-variant-numeric: tabular-nums; }

    .item-name { font-weight: 500; }
    .item-variant { font-size: 12px; color: #888; margin-top: 2px; }

    .total-row td {
      padding-top: 14px;
      border-bottom: none;
    }
    .total-label {
      font-size: 13px;
      font-weight: 600;
      color: #1a1a1a;
      text-align: right;
    }
    .total-amount {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    /* CTA Button */
    .btn {
      display: inline-block;
      padding: 11px 24px;
      background: #1a1a1a;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: -0.1px;
    }
    .btn-center { text-align: center; margin: 28px 0 4px; }

    /* OTP */
    .otp-block {
      background: #f9f9f9;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 32px 24px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-digits {
      font-size: 38px;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: #1a1a1a;
      font-variant-numeric: tabular-nums;
    }
    .otp-expiry {
      font-size: 12px;
      color: #888;
      margin-top: 10px;
    }

    /* Info notice */
    .notice {
      background: #fafafa;
      border: 1px solid #e8e8e8;
      border-left: 3px solid #d1d5db;
      border-radius: 0 6px 6px 0;
      padding: 14px 16px;
      margin: 24px 0;
    }
    .notice.warning {
      border-left-color: #f59e0b;
      background: #fffbeb;
    }
    .notice-title {
      font-size: 12px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 6px;
    }
    .notice ul {
      padding-left: 16px;
      font-size: 13px;
      color: #555;
    }
    .notice ul li { margin-top: 3px; }
    .notice p { font-size: 13px; color: #555; }

    /* Footer */
    .footer {
      text-align: center;
      margin-top: 28px;
      padding: 0 16px;
    }
    .footer-links {
      font-size: 12px;
      color: #aaa;
      margin-bottom: 6px;
    }
    .footer-links a { color: #888; text-decoration: none; }
    .footer-auto {
      font-size: 11px;
      color: #bbb;
    }
  `;

  private baseTemplate(content: string): string {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${this.styles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="brand">
        <span class="brand-name">Cửa hàng</span>
      </div>
      <div class="card">
        <div class="card-body">
          ${content}
        </div>
      </div>
      <div class="footer">
        <div class="footer-links">
          <a href="mailto:support@example.com">support@example.com</a>
          &nbsp;·&nbsp;
          1900-xxxx
        </div>
        <div class="footer-auto">Email tự động — vui lòng không trả lời</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  async sendOrderConfirmation(
    email: string,
    orderCode: string,
    orderDetails: any,
  ) {
    const { customerName, items, total, shippingAddress } = orderDetails;

    const itemRows = items
      .map((item: any) => {
        const variants = [
          item.size ? `Size: ${item.size}` : '',
          item.color ? `Màu: ${item.color}` : '',
        ]
          .filter(Boolean)
          .join(' · ');

        return `
          <tr>
            <td>
              <div class="item-name">${item.productName}</div>
              ${variants ? `<div class="item-variant">${variants}</div>` : ''}
            </td>
            <td class="center">${item.quantity}</td>
            <td class="right">${this.formatCurrency(item.price * item.quantity)}</td>
          </tr>
        `;
      })
      .join('');

    const content = `
      <p class="section-label">Xác nhận đơn hàng</p>
      <h1>Đặt hàng thành công</h1>
      <p class="subtitle">Cảm ơn bạn đã mua sắm. Đơn hàng đang chờ xử lý.</p>

      <div class="order-code-block">
        <div>
          <div class="order-code-label">Mã đơn hàng</div>
          <div class="order-code-value">${orderCode}</div>
        </div>
        <span class="order-badge" style="background:#eff6ff; border-color:#bfdbfe; color:#2563eb">Chờ xử lý</span>
      </div>

      <div class="divider"></div>

      <div class="meta-row">
        <span class="meta-label">Người nhận</span>
        <span class="meta-value">${customerName}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Địa chỉ giao hàng</span>
        <span class="meta-value" style="max-width:300px">${shippingAddress}</span>
      </div>

      <div class="divider"></div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th class="center">SL</th>
            <th class="right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr class="total-row">
            <td colspan="2" class="total-label">Tổng cộng</td>
            <td class="total-amount">${this.formatCurrency(total)}</td>
          </tr>
        </tbody>
      </table>

      <div class="divider"></div>

      <div class="btn-center">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/guest/lookup/${orderCode}?contact=${email}" class="btn">
          Tra cứu đơn hàng
        </a>
      </div>

      <div class="notice">
        <div class="notice-title">Lưu lại mã đơn hàng</div>
        <p>Sử dụng mã <strong>${orderCode}</strong> để theo dõi trạng thái giao hàng.</p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Xác nhận đơn hàng ${orderCode}`,
        html: this.baseTemplate(content),
      });
    } catch (error) {
      throw error;
    }
  }

  async sendPasswordReset(email: string, otp: string, userName?: string) {
    const content = `
      <p class="section-label">Bảo mật tài khoản</p>
      <h1>Mã khôi phục mật khẩu</h1>
      <p class="subtitle">Xin chào ${userName || 'bạn'}, dùng mã dưới đây để đặt lại mật khẩu cho tài khoản của bạn.</p>

      <div class="otp-block">
        <div class="otp-digits">${otp}</div>
        <div class="otp-expiry">Hiệu lực trong 10 phút</div>
      </div>

      <div class="divider"></div>

      <div class="notice">
        <div class="notice-title">Lưu ý</div>
        <ul>
          <li>Mã này có hiệu lực trong <strong>10 phút</strong></li>
          <li>Không chia sẻ mã này với bất kỳ ai để bảo vệ tài khoản</li>
        </ul>
      </div>

      <div class="notice warning">
        <div class="notice-title">Không phải bạn?</div>
        <p>Nếu bạn không thực hiện yêu cầu này, hãy đổi mật khẩu ngay hoặc liên hệ hỗ trợ.</p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: this.baseTemplate(content),
      });
    } catch (error) {
      throw error;
    }
  }

  async sendVerificationCode(email: string, code: string, userName?: string) {
    const content = `
      <p class="section-label">Xác thực tài khoản</p>
      <h1>Mã xác thực của bạn</h1>
      <p class="subtitle">Xin chào ${userName || 'bạn'}, dùng mã dưới đây để hoàn tất đăng ký tài khoản.</p>

      <div class="otp-block">
        <div class="otp-digits">${code}</div>
        <div class="otp-expiry">Hiệu lực trong 10 phút</div>
      </div>

      <div class="notice">
        <div class="notice-title">Lưu ý bảo mật</div>
        <ul>
          <li>Không chia sẻ mã này với bất kỳ ai, kể cả nhân viên hỗ trợ</li>
          <li>Nếu không phải bạn đăng ký, bỏ qua email này</li>
        </ul>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Xác thực tài khoản của bạn',
        html: this.baseTemplate(content),
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