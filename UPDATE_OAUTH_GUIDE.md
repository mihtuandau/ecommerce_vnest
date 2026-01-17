# 🔐 Hướng Dẫn Fix Google OAuth cho Production

## ⚠️ Vấn Đề
Google OAuth không hoạt động trên VPS vì redirect URL đang sử dụng localhost thay vì domain production.

## ✅ Giải Pháp

### Bước 1: Cập nhật Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn
3. Vào **APIs & Services** → **Credentials**
4. Click vào OAuth 2.0 Client ID: `798971390195-frj4lllua4hrn07av2lidltmm9p47f4r.apps.googleusercontent.com`

#### Thêm Authorized redirect URIs:
```
https://api.dautuan.com/api/auth/google-login/callback
http://localhost:5000/api/auth/google-login/callback
```

#### Thêm Authorized JavaScript origins:
```
https://dautuan.com
https://www.dautuan.com  
https://api.dautuan.com
http://localhost:5173
http://localhost:5000
```

5. Click **SAVE**

---

### Bước 2: Cập nhật .env trên VPS

```bash
# SSH vào VPS
ssh root@223.130.11.30

# Edit .env file
nano /var/www/eccommerce_api/E_Co_Vnest/servers/.env
```

Thay đổi các dòng sau:

```env
# ❌ TRƯỚC (SAI)
FRONTEND_URL=http://localhost:5173,https://dautuan.com

# ✅ SAU (ĐÚNG) - Chỉ dùng production URL
FRONTEND_URL=https://dautuan.com

# Đảm bảo NODE_ENV là production
NODE_ENV=production
```

**File .env đầy đủ trên VPS:**
```env
# DB
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password_here_change_this
POSTGRES_DB=ecommerce

# App
DATABASE_URL=postgresql://postgres:secure_password_here@db:5432/ecommerce?schema=public
JWT_SECRET=Tx8#kP!9mQ@2sV5&rL*WpE(6zYbCdFgHjRnM
JWT_REFRESH_SECRET=another-secure-secret-key-for-refresh-token
PORT=5000
NODE_ENV=production

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=dautuan032004@gmail.com
MAIL_PASSWORD=khuf jtsi plyb drne
MAIL_FROM=dautuan032004@gmail.com
MAIL_FROM_NAME=E-Commerce Shop

# OAuth - PRODUCTION ONLY
GOOGLE_CLIENT_ID=798971390195-frj4lllua4hrn07av2lidltmm9p47f4r.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
FRONTEND_URL=https://dautuan.com

# CORS
ALLOWED_ORIGINS=https://dautuan.com,https://www.dautuan.com,https://api.dautuan.com

# Admin
ADMIN_EMAILS=dautuan032004@gmail.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=dartz7uwu  
CLOUDINARY_API_KEY=549886289377171
CLOUDINARY_API_SECRET=eW7rSsVzuiasSL_J-j_WgfrJjtA

# Redis
REDIS_USERNAME=default
REDIS_PASSWORD=ZSDFu9dmGt7bclvt3DN9V38F8BjC2c64
REDIS_HOST=redis-19642.c9.us-east-1-4.ec2.cloud.redislabs.com:19642
REDIS_CACHE_EXPIRATION=3600
USE_REDIS_CACHE=true

# Gemini AI
GEMINI_API_KEY=AIzaSyATfFsFi8ff9ErGapCvlr8tCI3BQrwJqKw

# GHTK Shipping
GHTK_API_URL=https://services-staging.ghtklab.com
GHTK_TOKEN=38JHW8NdGBfqeEBrJlvPeW4Ea7nalUM5hngCDLX
```

Lưu file: **Ctrl + X** → **Y** → **Enter**

---

### Bước 3: Restart Docker Containers

```bash
cd /var/www/eccommerce_api/E_Co_Vnest/servers

# Restart để load .env mới
docker-compose down
docker-compose up -d

# Xem logs để verify
docker-compose logs -f server
```

---

### Bước 4: Test Google Login

1. Mở trình duyệt ở chế độ **Incognito**
2. Truy cập: `https://dautuan.com`
3. Click nút **"Đăng nhập bằng Google"**
4. Chọn tài khoản Gmail
5. Sau khi authorize, bạn sẽ được redirect về: `https://dautuan.com/?oauth_success=true&user_data=...`

---

## 🔍 Verify OAuth Flow

### Kiểm tra redirect URL trong code:

File: `servers/src/auth/auth.controller.ts` (dòng 133-138)

```typescript
const frontendUrl = process.env.FRONTEND_URL;

return res.redirect(
  `${frontendUrl}/?oauth_success=true&user_data=${encodedUser}`,
);
```

- Đảm bảo `FRONTEND_URL=https://dautuan.com` (không có dấu `/` ở cuối)
- Code sẽ redirect về: `https://dautuan.com/?oauth_success=true&user_data=...`

---

## 🐛 Troubleshooting

### Lỗi: "redirect_uri_mismatch"

**Nguyên nhân:** Google OAuth redirect URI không khớp với cái đã đăng ký trên Google Cloud Console.

**Giải pháp:**
1. Check URL trong error message
2. Đảm bảo đã add URL đó vào **Authorized redirect URIs** trên Google Console
3. Đợi 5-10 phút để Google cập nhật

### Lỗi: "Access blocked: This app's request is invalid"

**Nguyên nhân:** Authorized JavaScript origins không có domain của bạn.

**Giải pháp:**
1. Thêm `https://dautuan.com` vào **Authorized JavaScript origins**
2. Save và đợi vài phút

### Lỗi: Redirect về localhost thay vì production

**Nguyên nhân:** `FRONTEND_URL` trong .env vẫn có `localhost` ở đầu.

**Giải pháp:**
```bash
# Check biến môi trường trong container
docker-compose exec server printenv | grep FRONTEND_URL

# Phải là: FRONTEND_URL=https://dautuan.com
# KHÔNG ĐƯỢC: FRONTEND_URL=http://localhost:5173,https://dautuan.com

# Nếu sai, sửa .env và restart
nano /var/www/eccommerce_api/E_Co_Vnest/servers/.env
docker-compose down
docker-compose up -d
```

---

## 📝 Lưu Ý Development vs Production

### Development (.env local):
```env
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Production (.env trên VPS):
```env
FRONTEND_URL=https://dautuan.com
NODE_ENV=production
ALLOWED_ORIGINS=https://dautuan.com,https://www.dautuan.com,https://api.dautuan.com
```

**QUAN TRỌNG:** Không dùng nhiều URLs trong `FRONTEND_URL` vì code chỉ lấy URL đầu tiên để redirect!

---

## ✨ Hoàn thành!

Sau khi làm xong các bước trên, Google OAuth sẽ hoạt động bình thường trên production:

- ✅ User click "Login with Google" trên `https://dautuan.com`
- ✅ Redirect đến Google để xác thực
- ✅ Sau khi xác thực, redirect về `https://api.dautuan.com/api/auth/google-login/callback`
- ✅ Backend tạo JWT token và set cookie
- ✅ Redirect về `https://dautuan.com/?oauth_success=true&user_data=...`
- ✅ Frontend lưu token và đăng nhập thành công

**Test bằng Incognito mode để tránh cache!**
