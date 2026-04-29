# BÁO CÁO ĐÁNH GIÁ TOÀN DIỆN KIẾN TRÚC & BẢO MẬT HỆ THỐNG E-CO VNEST
*(Comprehensive System Assessment & Security Evaluation)*

Tài liệu này cung cấp một cái nhìn X-Ray (chụp X-Quang) vào toàn bộ lõi của hệ thống E-Co Vnest, đánh giá luồng nghiệp vụ từ góc độ kỹ thuật cấp thấp, chỉ ra các quyết định thiết kế (Design Decisions) và mổ xẻ những điểm nghẽn có thể xảy ra.

---

## 1. PHÂN TÍCH CHI TIẾT TỪNG LUỒNG NGHIỆP VỤ (BUSINESS FLOWS)

### 1.1. Luồng Xác thực & Phân quyền (Authentication & Authorization)
*   **Mô tả**: Quản lý việc người dùng đăng nhập và được cấp quyền truy cập các tài nguyên hệ thống.
*   **Luồng hoạt động**:
    1.  User gửi `email` và `password` tới `/api/auth/login`.
    2.  Hệ thống kiểm tra `bcrypt.compare()` để xác thực mật khẩu.
    3.  Tạo ra 2 loại Token: `AccessToken` (thời hạn ngắn, lưu ở Client) và `RefreshToken` (thời hạn dài, lưu trong HTTP-Only Cookie chống XSS).
    4.  Mã băm của `RefreshToken` được lưu vào bảng `RefreshToken` trong DB để quản lý (hỗ trợ thu hồi/revoke khi user logout hoặc bị ban).
*   **Bảo mật Guard**: Mọi API nội bộ được bảo vệ bởi `JwtAuthGuard` (Giải mã Token) và `RolesGuard` (Kiểm tra xem Role của User có nằm trong mảng cho phép `@Roles()` hay không).

### 1.2. Luồng Quản lý Sản phẩm & Biến thể (Product & Inventory)
*   **Mô tả**: Tách bạch giữa thông tin chung (Product) và thông tin kho hàng (Variant).
*   **Luồng hoạt động**:
    1.  Admin tạo Product (Tên, Mô tả, Category, Brand).
    2.  Admin thêm các ProductVariant (Size L màu Đỏ, Size M màu Xanh).
    3.  **Tồn kho (Stock)** được quản lý độc lập tại cấp độ Variant. Khi khách mua "Áo Thun size L", hệ thống chỉ trừ kho của đúng Variant "Size L", không ảnh hưởng đến "Size M".
*   **Tự động dọn rác (Auto Cleanup)**: Khi Admin đổi ảnh mới hoặc xóa ảnh cũ, Backend không chỉ xóa URL trong DB mà còn gọi hàm `cloudinary.uploader.destroy()` để xóa file vật lý trên Cloud, giúp tiết kiệm bộ nhớ máy chủ.

### 1.3. Luồng Đồng bộ Giỏ hàng (Cart Synchronization)
*   **Vấn đề**: Next.js không thể đọc LocalStorage của User trên Server-side.
*   **Cách hệ thống giải quyết**:
    1.  Khi khách vãng lai (Guest) chọn hàng, dữ liệu lưu hoàn toàn dưới dạng JSON trong LocalStorage (qua Redux Persist).
    2.  Ngay khi khách click Đăng nhập thành công, Frontend lập tức ném chuỗi JSON này lên `POST /api/cart/sync`.
    3.  Backend lấy giỏ hàng Local gộp vào giỏ hàng DB của User. Nếu trùng `variantId` thì cộng dồn `quantity`.
    4.  Frontend nhận phản hồi thành công, tự động xóa trắng LocalStorage và tải lại Cart từ DB. Quá trình mượt mà đến mức khách không nhận ra.

### 1.4. Luồng Đặt hàng (Order & Checkout Flow)
Đây là "Trái tim" của hệ thống, bao gồm 7 bước khóa chéo cực kỳ chặt chẽ:
1.  **Validate Input**: Kiểm tra `address`, `variantId`, `quantity`.
2.  **Tính giá Flash Sale vs Voucher**: Hệ thống tự động so sánh xem khách áp dụng Mã Voucher (Discount) hay giá Flash Sale tự động mang lại nhiều lợi ích hơn, và chọn mức giá thấp nhất cho khách.
3.  **Validate Discount**: Bắt lỗi nếu mã giảm giá hết hạn, hết số lượng, hoặc User/Guest này đã từng sử dụng mã này rồi (bám vết qua `userId`, `guestEmail`, `guestPhone`).
4.  **Tính Phí Vận Chuyển**: Chọc API sang Giao Hàng Nhanh (GHN), tính trọng lượng cấu hình trong Variant (Ví dụ: 200 gram) x Số lượng = Tổng cân nặng -> Ra phí ship thực tế.
5.  **Atomic Inventory Update**: Bắt đầu `Prisma.$transaction`. Gửi lệnh trừ kho `UPDATE Variant SET stock = stock - quantity WHERE stock >= quantity`. Nếu bị khóa DB hoặc hết hàng, Rollback toàn bộ 4 bước trước.
6.  **Snapshot OrderItem**: Lưu vào DB một bản sao (Snapshot) chứa Tên Sản Phẩm, Giá Lúc Mua, Cấu hình Màu/Size.
7.  **Tạo Payment Link**: Gọi sang VNPay để tạo mã QR Code hoặc URL thanh toán.

### 1.5. Luồng Thanh toán VNPay (IPN Webhook)
*   **Mô tả**: Đảm bảo khách hàng không sửa số tiền trước khi thanh toán.
*   **Luồng hoạt động**:
    1.  VNPay gọi về `GET /api/payments/vnpay-ipn`.
    2.  Hệ thống bóc tách Header, lấy chuỗi băm (Signature).
    3.  Dùng `HMAC-SHA512` mã hóa lại payload với Secret Key lưu trên Server. So sánh 2 chữ ký. Nếu sai -> Đánh dấu là tấn công mạo danh (Lỗi 97).
    4.  Lấy số tiền khách vừa quẹt (`vnp_Amount / 100`) so sánh với `order.total` trong CSDL. Nếu sai lệch dù chỉ 1 đồng -> Khóa đơn hàng, báo lỗi gian lận (Lỗi 04).
    5.  Khớp 100% -> Chuyển đơn sang `PROCESSING`.

### 1.6. Luồng Hủy & Trả hàng (Cancel & Return Logic)
*   **Luồng hoạt động**:
    1.  Admin chuyển trạng thái đơn hàng sang `RETURNED` hoặc `CANCELLED`.
    2.  **Double Restoration Guard**: Hệ thống quét lịch sử `oldOrder.status`. Nếu trạng thái trước đó đã là `RETURNED` (nghĩa là kho đã được hoàn lại), hệ thống sẽ ngắt bỏ lệnh hoàn kho. Tránh tình trạng Admin click nhầm làm kho bị cộng lên gấp đôi.
    3.  Lệnh cộng kho cũng chạy Atomic Update để tránh xung đột dữ liệu.

---

## 2. KIẾN TRÚC CƠ SỞ DỮ LIỆU CHUYÊN SÂU (DATABASE DESIGN)

### 2.1. Kỹ Thuật Snapshot (Hóa Đơn Bất Biến)
*   Bảng `OrderItem` không dựa vào relation để lấy giá sản phẩm.
*   Cột `price (Float)` và `productName (String)` lưu chết giá trị tại khoảnh khắc bấm mua. Dù ngày hôm sau bảng `ProductVariant` có bị Admin xóa khỏi Database, hóa đơn của khách vẫn giữ nguyên giá trị pháp lý, không bị lỗi Null Reference.

### 2.2. Kỹ Thuật Soft Delete (Xóa Mềm)
*   Bảng `Product`, `User`, `Order` đều có cột `deletedAt`.
*   Khi Admin nhấn "Xóa Sản Phẩm", hệ thống thực chất gọi hàm `Update({ deletedAt: new Date() })`.
*   **Đồng bộ Query**: Toàn bộ các Query quan trọng trong `product.repository.ts` đều đã được hardcode thêm điều kiện `where: { deletedAt: null }`. Đảm bảo Frontend không bao giờ nhìn thấy sản phẩm "đã xóa", trong khi Backend vẫn giữ được cục Data gốc để phục vụ Report Doanh thu.

### 2.3. Khóa chống trùng lặp (Anti-Fraud Constraints)
*   Bảng `DiscountUsage` không dùng `@unique` ở tầng DB cho Guest vì `null` sẽ bypass constraint.
*   Thay vào đó, hệ thống gài điều kiện ở tầng Application: Lệnh `findFirst` sẽ quét `userId` HOẶC `guestEmail` HOẶC `guestPhone` để đảm bảo 1 thực thể con người chỉ được xài Voucher duy nhất 1 lần.

---

## 3. ĐÁNH GIÁ ĐỘ TRƯỞNG THÀNH BẢO MẬT (SECURITY POSTURE)

### 3.1. Chống Spam & DDoS (Rate Limiting)
*   API nhạy cảm được bảo vệ bởi `@nestjs/throttler`.
*   `/api/auth/login`: Chống Brute-force mật khẩu (Max 5 lần / 5 phút).
*   `/api/orders`: Chống Spam xả rác đơn ảo làm cạn kiệt tồn kho (Max 3 lần / 1 phút).

### 3.2. Data Masking (Bảo vệ thông tin cá nhân - PII)
*   API tra cứu đơn hàng vãng lai (`Guest Order Lookup`) hoạt động dạng Public. Đối thủ có thể dùng tool cào toàn bộ đơn hàng bằng cách đoán `orderCode`.
*   Để chống lại, hệ thống có hàm `maskPII()`. SĐT `0901234567` sẽ bị biến thành `090****567`. Đối thủ thấy được đơn hàng nhưng không thể cướp được Data khách. Hơn nữa, việc tải Hóa Đơn PDF (Invoice) cũng bị chặn với khách vãng lai nếu đơn đó thuộc về 1 Member.

### 3.3. Xác thực Nguồn Gốc Webhook (Signature Verification)
*   Giao Hàng Nhanh (GHN) khi đẩy trạng thái về `/api/orders/ghn-webhook` bắt buộc phải kèm theo một Header `token`.
*   Server sẽ đối chiếu token này với biến môi trường `GHN_TOKEN`. Nếu không khớp, trả về `401 Unauthorized`. Kẻ gian không thể giả mạo bưu tá GHN để đổi trạng thái đơn.

---

## 4. TỔNG KẾT ĐIỂM MẠNH KIẾN TRÚC (ARCHITECTURAL STRENGTHS)

1.  **Tính ACID Tuyệt Đối**: Áp dụng Prisma Transaction khắt khe ở mọi nơi liên đới tới Tài chính (Trừ kho, Áp Voucher, Trừ Voucher, Sinh Hóa đơn). Không có khái niệm "lỗi một nửa" - Data luôn ở trạng thái Hoàn Hảo.
2.  **Độc Lập Tích Hợp (Decoupling)**: API của GHN và VNPay được bọc trong các lớp Service riêng. Nếu mai này Shop muốn đổi qua Giao Hàng Tiết Kiệm (GHTK) hoặc Momo, chỉ việc thay module mà không ảnh hưởng tới lõi Order Creation.
3.  **Tối ưu SEO Backend**: Việc trả về cấu trúc Slug và cho phép Next.js query bằng `findByIdOrSlug` giúp SEO hoạt động cực kỳ hiệu quả mà không cần thiết kế lại Database.

---

## 5. ĐIỂM YẾU & ROADMAP NÂNG CẤP (WEAKNESSES & UPGRADE ROADMAP)

Mặc dù kiến trúc rất vững vàng, nhưng nếu chuẩn bị để Scale (Nhân bản Server) phục vụ 100,000 CCU, hệ thống cần vá ngay 3 lỗ hổng sau:

### 5.1. Thiếu Distributed Lock (Khóa phân tán) cho Cronjob
*   **Tình trạng hiện tại**: Tác vụ "Hủy đơn treo sau 30 phút" chạy bằng `@nestjs/schedule` (Local RAM). Nếu ta bật 3 server Backend cùng lúc, tác vụ này sẽ chạy 3 lần, thi nhau truy cập vào một đơn hàng.
*   **Roadmap**: Cần thiết lập **BullMQ** hoặc **Redis Redlock**. Chỉ một Server được lấy "Khóa" và thực hiện quét DB.

### 5.2. Refresh Token chưa có tính năng Rotation
*   **Tình trạng hiện tại**: Refresh Token đang có thời hạn quá dài (7 ngày) và được tái sử dụng nhiều lần để xin Access Token. Nếu hacker lấy trộm được Refresh Token dưới Cookie, chúng có thể cắm tool dùng 7 ngày liên tục.
*   **Roadmap**: Mỗi khi Refresh Token được sử dụng, Backend phải xóa nó đi và sinh ra một bộ Access Token + Refresh Token MỚI hoàn toàn (Rotation). Nếu hệ thống phát hiện 1 Refresh Token cũ bị đem ra dùng lại -> Có người đang xài đồ ăn cắp -> Lập tức khóa toàn bộ session của User đó.

### 5.3. Xung đột OAuth (Tài khoản Google và Local)
*   **Tình trạng hiện tại**: Nếu khách đăng ký bằng Email `A@gmail.com` qua mật khẩu, sau đó lại bấm nút "Login with Google" với chính Email đó, hệ thống có thể bị bối rối hoặc báo lỗi do xung đột Unique Constraint.
*   **Roadmap**: Viết một Account Merging Logic. Tự động nhận dạng `email` trùng khớp và liên kết (Link Account) tài khoản Google vào tài khoản Local hiện có thay vì văng lỗi.

---
> **[KẾT THÚC BÁO CÁO]** 
> *Tài liệu đánh giá này đóng vai trò kim chỉ nam cho CTO và Team Lead trong việc định hướng phát triển và bảo trì E-Co Vnest trong vòng 3-5 năm tới.*
