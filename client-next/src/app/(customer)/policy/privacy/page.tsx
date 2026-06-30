import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[1000px] mx-auto py-12 md:py-20 px-4 sm:px-6">
      <header className="mb-12 border-b border-brand-sand/50 pb-8">
        <h1 className="text-2xl font-bold text-brand-espresso mb-2">Chính sách bảo mật</h1>
        <p className="text-brand-taupe text-sm">
          Bảo vệ dữ liệu cá nhân là ưu tiên hàng đầu tại LUXE
        </p>
      </header>

      <div className="space-y-10 text-brand-espresso/85 leading-relaxed text-base font-normal">
        <section>
          <h2 className="font-bold text-brand-espresso mb-3">
            01. Mục đích thu thập thông tin
          </h2>
          <p className="mb-3">
            Chúng tôi thu thập thông tin cá nhân của khách hàng nhằm mục đích cung cấp
            dịch vụ tốt nhất và cải thiện trải nghiệm mua sắm:
          </p>
          <ul className="list-none space-y-2">
            <li>• Xử lý đơn hàng và giao hàng đến địa chỉ yêu cầu.</li>
            <li>• Cung cấp thông tin cập nhật về tình trạng đơn hàng.</li>
            <li>• Gửi bản tin khuyến mãi (nếu khách hàng đồng ý).</li>
            <li>• Ngăn ngừa các hành vi gian lận và nâng cao bảo mật.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-brand-espresso mb-3">
            02. Các loại thông tin thu thập
          </h2>
          <p>
            Chúng tôi thu thập các thông tin bao gồm: Họ tên, địa chỉ email, số điện
            thoại, địa chỉ nhận hàng và lịch sử giao dịch. Các thông tin này được bảo
            mật tuyệt đối và chỉ sử dụng cho các mục đích đã nêu trên.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-brand-espresso mb-3">03. Bảo mật thanh toán</h2>
          <p>
            LUXE áp dụng các tiêu chuẩn bảo mật cao nhất cho giao dịch trực tuyến. Chúng
            tôi sử dụng chứng chỉ SSL để mã hóa dữ liệu truyền tải. Mọi giao dịch qua
            thẻ hoặc ví điện tử đều được xử lý thông qua cổng thanh toán uy tín và không
            lưu trữ thông tin thẻ tại hệ thống của chúng tôi.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-brand-espresso mb-3">04. Cam kết bảo mật</h2>
          <p>
            Chúng tôi cam kết không bán, chia sẻ hay trao đổi thông tin cá nhân của
            khách hàng cho bất kỳ bên thứ ba nào khi chưa có sự đồng ý, trừ trường hợp
            cơ quan pháp luật yêu cầu.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-brand-espresso mb-3">05. Quyền của khách hàng</h2>
          <p>
            Quý khách có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của
            mình bất kỳ lúc nào thông qua trang quản lý tài khoản hoặc liên hệ trực tiếp
            với bộ phận hỗ trợ của LUXE.
          </p>
        </section>
      </div>
    </div>
  );
}

