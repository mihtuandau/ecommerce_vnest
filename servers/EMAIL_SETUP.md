# Email Configuration Guide

## Setup Gmail cho gửi email tự động

### 1. Bật 2-Step Verification
1. Truy cập: https://myaccount.google.com/security
2. Chọn "2-Step Verification"
3. Làm theo hướng dẫn để bật

### 2. Tạo App Password
1. Truy cập: https://myaccount.google.com/apppasswords
2. Chọn "Mail" và "Other" (nhập tên: NestJS App)
3. Copy 16-ký tự password được tạo
4. Paste vào `MAIL_PASSWORD` trong file `.env`

### 3. Cấu hình .env

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_FROM=your-email@gmail.com
MAIL_FROM_NAME=E-Commerce Shop
FRONTEND_URL=http://localhost:5173
```

### 4. Test Email

Sau khi cấu hình, đặt hàng thử nghiệm để kiểm tra:
- ✅ Email được gửi đến khách hàng (logged-in hoặc guest)
- ✅ Hiển thị đầy đủ: mã đơn hàng, sản phẩm, tổng tiền, địa chỉ
- ✅ Link tra cứu đơn hàng hoạt động

### 5. Troubleshooting

**Lỗi "Invalid login":**
- Kiểm tra App Password đã tạo đúng chưa
- Đảm bảo không có khoảng trắng trong password
- Thử tạo App Password mới

**Email không nhận được:**
- Kiểm tra spam/junk folder
- Verify email configuration trong console logs
- Check port 587 không bị firewall chặn

**Production (khuyến nghị):**
- Sử dụng SendGrid, Mailgun, AWS SES thay vì Gmail
- Giới hạn rate limit Gmail: 500 emails/day
